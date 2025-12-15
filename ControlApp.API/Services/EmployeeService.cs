using Microsoft.EntityFrameworkCore;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using ControlApp.API;

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
            return await _employeeRepository.DeleteAsync(id);
        }

        private static EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                Id = employee.Id,
                EmployeeName = employee.EmployeeName,
                TypeId = employee.TypeId,
                TypeName = employee.Type?.TypeName,
                Description = employee.Description
            };
        }
    }
}