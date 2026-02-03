using Microsoft.EntityFrameworkCore;
using ControlApp.API;
using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public class ControlRepository : Repository<Controls>, IControlRepository
    {
        public ControlRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Controls>> GetControlsWithDetailsAsync(string? searchTerm = null)
        {
            var query = _dbSet
                .Include(c => c.Type)
                .Include(c => c.Employee)
                .Include(c => c.QAEmployee)
                .Include(c => c.Status)
                .Include(c => c.Release) 
                .AsQueryable();

            
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(c => 
                    (c.Employee != null && c.Employee.EmployeeName.ToLower().Contains(searchTerm)) ||
                    (c.Description != null && c.Description.ToLower().Contains(searchTerm))
                );
            }

            return await query.ToListAsync();
        }

        public async Task<Controls?> GetControlWithDetailsByIdAsync(int id)
        {
            return await _dbSet
                .Include(c => c.Type)
                .Include(c => c.Employee)
                .Include(c => c.QAEmployee)
                .Include(c => c.Status)
                .Include(c => c.Release)
                .FirstOrDefaultAsync(c => c.ControlId == id);
        }

        public override async Task<Controls?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public override async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetControlWithDetailsByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}