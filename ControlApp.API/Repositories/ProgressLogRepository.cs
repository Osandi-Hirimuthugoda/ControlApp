using Microsoft.EntityFrameworkCore;
using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public class ProgressLogRepository : Repository<ProgressLog>, IProgressLogRepository
    {
        public ProgressLogRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ProgressLog>> GetProgressLogsByControlIdAsync(int controlId)
        {
            return await _context.Set<ProgressLog>()
                .Where(p => p.ControlId == controlId)
                .Include(p => p.Status)
                .Include(p => p.Employee)
                .Include(p => p.Control)
                .OrderByDescending(p => p.LogDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProgressLog>> GetProgressLogsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Set<ProgressLog>()
                .Where(p => p.LogDate.Date >= startDate.Date && p.LogDate.Date <= endDate.Date)
                .Include(p => p.Status)
                .Include(p => p.Employee)
                .Include(p => p.Control)
                .OrderByDescending(p => p.LogDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProgressLog>> GetProgressLogsByEmployeeIdAsync(int employeeId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Set<ProgressLog>()
                .Where(p => p.EmployeeId == employeeId);

            if (startDate.HasValue)
                query = query.Where(p => p.LogDate.Date >= startDate.Value.Date);

            if (endDate.HasValue)
                query = query.Where(p => p.LogDate.Date <= endDate.Value.Date);

            return await query
                .Include(p => p.Status)
                .Include(p => p.Employee)
                .Include(p => p.Control)
                .OrderByDescending(p => p.LogDate)
                .ToListAsync();
        }

        public async Task<ProgressLog?> GetLatestProgressLogForControlAsync(int controlId)
        {
            return await _context.Set<ProgressLog>()
                .Where(p => p.ControlId == controlId)
                .Include(p => p.Status)
                .Include(p => p.Employee)
                .Include(p => p.Control)
                .OrderByDescending(p => p.LogDate)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ProgressLog>> GetDailyProgressLogsAsync(DateTime date, int? teamId = null)
        {
            var query = _context.Set<ProgressLog>()
                .Where(p => p.LogDate.Date == date.Date)
                .Include(p => p.Status)
                .Include(p => p.Employee)
                .Include(p => p.Control)
                .AsQueryable();

            // Filter by team if teamId is provided
            if (teamId.HasValue)
            {
                query = query.Where(p => p.Control != null && p.Control.TeamId == teamId.Value);
            }

            return await query
                .OrderBy(p => p.ControlId)
                .ThenByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> HasProgressLogForDateAsync(int controlId, DateTime date)
        {
            return await _context.Set<ProgressLog>()
                .AnyAsync(p => p.ControlId == controlId && p.LogDate.Date == date.Date);
        }
    }
}