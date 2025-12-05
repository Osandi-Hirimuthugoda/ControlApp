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
            if (string.IsNullOrWhiteSpace(createEmployeeDto.EmployeeName))
            {
                throw new ArgumentException("Employee name is required.");
            }

            var employee = new Employee
            {
                EmployeeName = createEmployeeDto.EmployeeName.Trim(),
                TypeId = createEmployeeDto.TypeId,
                Description = createEmployeeDto.Description?.Trim()
            };

            var createdEmployee = await _employeeRepository.AddAsync(employee);
            
            
            try
            {
                
                int typeIdToUse;
                if (createdEmployee.TypeId.HasValue)
                {
                    
                    var typeExists = await _context.Set<ControlType>()
                        .AnyAsync(t => t.ControlTypeId == createdEmployee.TypeId.Value);
                    
                    if (typeExists)
                    {
                        typeIdToUse = createdEmployee.TypeId.Value;
                    }
                    else
                    {
                        
                        var defaultType = await _context.Set<ControlType>().FirstOrDefaultAsync();
                        if (defaultType == null)
                            throw new InvalidOperationException("No ControlType found in database. Please create at least one ControlType first.");
                        typeIdToUse = defaultType.ControlTypeId;
                    }
                }
                else
                {
                    var defaultType = await _context.Set<ControlType>().FirstOrDefaultAsync();
                    if (defaultType == null)
                        throw new InvalidOperationException("No ControlType found in database. Please create at least one ControlType first.");
                    typeIdToUse = defaultType.ControlTypeId;
                }

                
                var defaultStatus = await _context.Set<Status>().FirstOrDefaultAsync();
                var defaultRelease = await _context.Set<Release>().FirstOrDefaultAsync();

                var control = new Controls
                {
                    Description = createEmployeeDto.Description ?? $"Control for {createdEmployee.EmployeeName}",
                    Comments = "",
                    TypeId = typeIdToUse,
                    EmployeeId = createdEmployee.Id,
                    StatusId = defaultStatus?.Id, 
                    ReleaseId = defaultRelease?.ReleaseId,
                    Progress = 0, 
                    ReleaseDate = null
                };

                await _context.Set<Controls>().AddAsync(control);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                
                Console.WriteLine($"Warning: Failed to create control for employee {createdEmployee.Id}: {ex.Message}");
                
                if (ex is InvalidOperationException)
                    throw;
            }
            
            
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
