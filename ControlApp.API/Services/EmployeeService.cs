using Microsoft.EntityFrameworkCore;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using ControlApp.API;
using BCrypt.Net;

namespace ControlApp.API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly AppDbContext _context;

        public EmployeeService(IEmployeeRepository employeeRepository, AppDbContext context)
        {
            _employeeRepository = employeeRepository;
            _context = context;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _employeeRepository.GetEmployeesWithDetailsAsync();
            return employees.Select(MapToDto);
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _employeeRepository.GetEmployeeWithDetailsByIdAsync(id);
            return employee != null ? MapToDto(employee) : null;
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto)
        {
            // 1. Validate Input
            if (string.IsNullOrWhiteSpace(createEmployeeDto.EmployeeName))
            {
                throw new ArgumentException("Employee name is required.");
            }

            // 2. Create Employee Object
            var employee = new Employee
            {
                EmployeeName = createEmployeeDto.EmployeeName.Trim(),
                TypeId = createEmployeeDto.TypeId,
                Description = createEmployeeDto.Description?.Trim()
            };

            // Save Employee to Database
            var createdEmployee = await _employeeRepository.AddAsync(employee);

            // Create Control Record
            try
            {
                // Check if a TypeId was selected
                if (createdEmployee.TypeId.HasValue)
                {
                    // Fetch the selected ControlType to get its Description and ReleaseDate
                    var selectedType = await _context.Set<ControlType>()
                        .FirstOrDefaultAsync(t => t.ControlTypeId == createdEmployee.TypeId.Value);

                    if (selectedType != null)
                    {
                        // Get default Status and Release for FK constraints
                        var defaultStatus = await _context.Set<Status>().FirstOrDefaultAsync();
                        var defaultRelease = await _context.Set<Release>().FirstOrDefaultAsync();

                        // Create the Control object mapping data from the selected Type
                        var control = new Controls
                        {
                            EmployeeId = createdEmployee.Id,
                            TypeId = createdEmployee.TypeId.Value,
                            
                            //  AUTO FILL LOGIC
                            
                            Description = !string.IsNullOrWhiteSpace(selectedType.Description) 
                                ? selectedType.Description 
                                : (!string.IsNullOrWhiteSpace(createdEmployee.Description) 
                                    ? createdEmployee.Description 
                                    : $"Control for {createdEmployee.EmployeeName}"),
                            
                            // Use ControlType's ReleaseDate (can be null if not set)
                            ReleaseDate = selectedType.ReleaseDate,
                            
                            StatusId = defaultStatus?.Id,
                            ReleaseId = defaultRelease?.ReleaseId,
                            Progress = 0,
                            Comments = ""
                        };

                        await _context.Set<Controls>().AddAsync(control);
                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't stop the request since Employee is already created
                // Note: Logging will be added via ILogger in production
                System.Diagnostics.Debug.WriteLine($"Warning: Failed to create auto-control for employee {createdEmployee.Id}: {ex.Message}");
            }

            // Return the result
            var employeeWithDetails = await _employeeRepository.GetEmployeeWithDetailsByIdAsync(createdEmployee.Id);
            return employeeWithDetails != null ? MapToDto(employeeWithDetails) : MapToDto(createdEmployee);
        }

        public async Task<EmployeeDto> CreateEmployeeWithControlAsync(CreateEmployeeWithControlDto createEmployeeWithControlDto)
        {
            var createEmployeeDto = new CreateEmployeeDto
            {
                EmployeeName = createEmployeeWithControlDto.EmployeeName,
                TypeId = createEmployeeWithControlDto.TypeId,
                Description = createEmployeeWithControlDto.Description
            };

            return await CreateEmployeeAsync(createEmployeeDto);
        }

        public async Task<EmployeeDto> RegisterEmployeeWithUserAsync(RegisterEmployeeWithUserDto registerDto)
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == registerDto.Email || u.Email == registerDto.Email);

            User user;

            if (existingUser != null)
            {
                // User already exists - link employee to existing user
                // Update phone number if provided
                if (!string.IsNullOrWhiteSpace(registerDto.PhoneNumber))
                {
                    existingUser.PhoneNumber = registerDto.PhoneNumber;
                }

                // Update role based on selected employee role (e.g. Developer, QA Engineer)
                if (!string.IsNullOrWhiteSpace(registerDto.Role))
                {
                    existingUser.Role = registerDto.Role.Trim();
                }

                // Check if employee already exists for this user
                var existingEmployee = await _context.Set<Employee>()
                    .FirstOrDefaultAsync(e => e.UserId == existingUser.Id);

                if (existingEmployee != null)
                {
                    // Update existing employee details instead of throwing error
                    existingEmployee.EmployeeName = registerDto.EmployeeName.Trim();
                    existingEmployee.TypeId = registerDto.TypeId;
                    existingEmployee.Description = registerDto.Description?.Trim();

                    await _employeeRepository.UpdateAsync(existingEmployee);
                }
                else
                {
                    // No employee record yet, will be created below
                }

                // Persist updates to the existing user (phone/role changes) and employee (if any)
                await _context.SaveChangesAsync();

                user = existingUser;
            }
            else
            {
                // Create new User account
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
                user = new User
                {
                    Username = registerDto.Email, // Use email as username
                    Email = registerDto.Email,
                    PasswordHash = passwordHash,
                    FullName = registerDto.EmployeeName,
                    PhoneNumber = registerDto.PhoneNumber,
                    // Use the selected role from UI; fall back to "Employee" just in case
                    Role = string.IsNullOrWhiteSpace(registerDto.Role)
                        ? "Employee"
                        : registerDto.Role.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            // Create Employee record linked to User
            var employee = new Employee
            {
                EmployeeName = registerDto.EmployeeName.Trim(),
                TypeId = registerDto.TypeId,
                Description = registerDto.Description?.Trim(),
                UserId = user.Id // Link to User account
            };

            var createdEmployee = await _employeeRepository.AddAsync(employee);

            // Create Control Record if TypeId is provided
            try
            {
                if (createdEmployee.TypeId.HasValue)
                {
                    var selectedType = await _context.Set<ControlType>()
                        .FirstOrDefaultAsync(t => t.ControlTypeId == createdEmployee.TypeId.Value);

                    if (selectedType != null)
                    {
                        var defaultStatus = await _context.Set<Status>().FirstOrDefaultAsync();
                        var defaultRelease = await _context.Set<Release>().FirstOrDefaultAsync();

                        var control = new Controls
                        {
                            EmployeeId = createdEmployee.Id,
                            TypeId = createdEmployee.TypeId.Value,
                            Description = !string.IsNullOrWhiteSpace(selectedType.Description) 
                                ? selectedType.Description 
                                : (!string.IsNullOrWhiteSpace(createdEmployee.Description) 
                                    ? createdEmployee.Description 
                                    : $"Control for {createdEmployee.EmployeeName}"),
                            ReleaseDate = selectedType.ReleaseDate,
                            StatusId = defaultStatus?.Id,
                            ReleaseId = defaultRelease?.ReleaseId,
                            Progress = 0,
                            Comments = ""
                        };

                        await _context.Set<Controls>().AddAsync(control);
                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Warning: Failed to create auto-control for employee {createdEmployee.Id}: {ex.Message}");
            }

            // Return the result
            var employeeWithDetails = await _employeeRepository.GetEmployeeWithDetailsByIdAsync(createdEmployee.Id);
            return employeeWithDetails != null ? MapToDto(employeeWithDetails) : MapToDto(createdEmployee);
        }

        public async Task<EmployeeDto?> UpdateEmployeeAsync(int id, CreateEmployeeDto updateEmployeeDto)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
                return null;

            employee.EmployeeName = updateEmployeeDto.EmployeeName;
            employee.TypeId = updateEmployeeDto.TypeId;
            employee.Description = updateEmployeeDto.Description;

            await _employeeRepository.UpdateAsync(employee);

            var employeeWithDetails = await _employeeRepository.GetEmployeeWithDetailsByIdAsync(id);
            return employeeWithDetails != null ? MapToDto(employeeWithDetails) : MapToDto(employee);
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
                return false;

            try
            {
                // First, delete all controls associated with this employee
                var controlsToDelete = await _context.Set<Controls>()
                    .Where(c => c.EmployeeId == id)
                    .ToListAsync();

                if (controlsToDelete.Any())
                {
                    _context.Set<Controls>().RemoveRange(controlsToDelete);
                    await _context.SaveChangesAsync();
                }

                // Now delete the employee directly using context to avoid tracking issues
                // Re-fetch the employee to ensure it's tracked properly
                var employeeToDelete = await _context.Set<Employee>().FindAsync(id);
                if (employeeToDelete != null)
                {
                    _context.Set<Employee>().Remove(employeeToDelete);
                    await _context.SaveChangesAsync();
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                // Log the exception (in production, use ILogger)
                System.Diagnostics.Debug.WriteLine($"Error deleting employee {id}: {ex.Message}");
                throw;
            }
        }

        private static EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                Id = employee.Id,
                EmployeeName = employee.EmployeeName,
                Email = employee.User?.Email ?? string.Empty,
                PhoneNumber = employee.User?.PhoneNumber,
                Role = employee.User?.Role ?? string.Empty,
                TypeId = employee.TypeId,
                TypeName = employee.Type?.TypeName,
                Description = employee.Description
            };
        }
    }
}