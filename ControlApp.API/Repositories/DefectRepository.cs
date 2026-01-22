using ControlApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Repositories
{
    public class DefectRepository : Repository<Defect>, IDefectRepository
    {
        public DefectRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Defect>> GetByControlIdAsync(int controlId)
        {
            return await _context.Defects
                .Include(d => d.Control)
                .Include(d => d.ReportedBy)
                .Include(d => d.AssignedTo)
                .Include(d => d.Team)
                .Where(d => d.ControlId == controlId)
                .OrderByDescending(d => d.ReportedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Defect>> GetByTeamIdAsync(int teamId)
        {
            return await _context.Defects
                .Include(d => d.Control)
                .Include(d => d.ReportedBy)
                .Include(d => d.AssignedTo)
                .Include(d => d.Team)
                .Where(d => d.TeamId == teamId)
                .OrderByDescending(d => d.ReportedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Defect>> GetByStatusAsync(string status, int teamId)
        {
            return await _context.Defects
                .Include(d => d.Control)
                .Include(d => d.ReportedBy)
                .Include(d => d.AssignedTo)
                .Include(d => d.Team)
                .Where(d => d.Status == status && d.TeamId == teamId)
                .OrderByDescending(d => d.ReportedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Defect>> GetBySeverityAsync(string severity, int teamId)
        {
            return await _context.Defects
                .Include(d => d.Control)
                .Include(d => d.ReportedBy)
                .Include(d => d.AssignedTo)
                .Include(d => d.Team)
                .Where(d => d.Severity == severity && d.TeamId == teamId)
                .OrderByDescending(d => d.ReportedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Defect>> GetByAssignedToAsync(int employeeId)
        {
            return await _context.Defects
                .Include(d => d.Control)
                .Include(d => d.ReportedBy)
                .Include(d => d.AssignedTo)
                .Include(d => d.Team)
                .Where(d => d.AssignedToEmployeeId == employeeId)
                .OrderByDescending(d => d.ReportedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Defect>> GetByReportedByAsync(int employeeId)
        {
            return await _context.Defects
                .Include(d => d.Control)
                .Include(d => d.ReportedBy)
                .Include(d => d.AssignedTo)
                .Include(d => d.Team)
                .Where(d => d.ReportedByEmployeeId == employeeId)
                .OrderByDescending(d => d.ReportedDate)
                .ToListAsync();
        }
    }
}
