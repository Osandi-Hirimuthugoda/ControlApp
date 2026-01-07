using Microsoft.EntityFrameworkCore;
using ControlApp.API;
using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public class EmployeeRepository : Repository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Employee>> GetEmployeesWithDetailsAsync()
        {
            return await _dbSet
                .Include(e => e.Type)
                .Include(e => e.User)
                .ToListAsync();
        }

        public async Task<Employee?> GetEmployeeWithDetailsByIdAsync(int id)
        {
            return await _dbSet
                .Include(e => e.Type)
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public override async Task<Employee?> GetByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}

