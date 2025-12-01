using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
        Task<IEnumerable<Employee>> GetEmployeesWithDetailsAsync();
        Task<Employee?> GetEmployeeWithDetailsByIdAsync(int id);
    }
}

