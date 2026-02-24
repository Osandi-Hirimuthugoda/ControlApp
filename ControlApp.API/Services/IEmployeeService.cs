using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync(int? teamId = null);
        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
        Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto);
        Task<EmployeeDto> CreateEmployeeWithControlAsync(CreateEmployeeWithControlDto createEmployeeWithControlDto);
        Task<EmployeeDto> RegisterEmployeeWithUserAsync(RegisterEmployeeWithUserDto registerDto);
        Task<EmployeeDto?> UpdateEmployeeAsync(int id, CreateEmployeeDto updateEmployeeDto);
        Task<bool> DeleteEmployeeAsync(int id);
    }
}
