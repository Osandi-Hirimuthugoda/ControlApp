using Microsoft.EntityFrameworkCore;
using ControlApp.API;
using ControlApp.API.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ControlApp.API.Repositories
{
    public class EmployeeRepository : Repository<Employee>, IEmployeeRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public EmployeeRepository(AppDbContext context, IHttpContextAccessor httpContextAccessor) : base(context)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        
        private int? GetCurrentUserTeamId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null) return null;
            
            var teamIdClaim = user.FindFirst("TeamId")?.Value;
            if (int.TryParse(teamIdClaim, out int teamId))
            {
                return teamId;
            }
            return null;
        }
        
        private bool IsSuperAdmin()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null) return false;
            
            var isSuperAdminClaim = user.FindFirst("IsSuperAdmin")?.Value;
            return isSuperAdminClaim == "True" || isSuperAdminClaim == "true";
        }

        public async Task<IEnumerable<Employee>> GetEmployeesWithDetailsAsync(int? teamId = null)
        {
            var query = _dbSet
                .Include(e => e.Type)
                .Include(e => e.User)
                .Include(e => e.Team)
                .AsQueryable();
                
            // Log for debugging
            var totalEmployeesBeforeFilter = await query.CountAsync();
            Console.WriteLine($"[EmployeeRepository] Total employees in database: {totalEmployeesBeforeFilter}");
            Console.WriteLine($"[EmployeeRepository] Requested teamId: {teamId?.ToString() ?? "null"}");
            Console.WriteLine($"[EmployeeRepository] IsSuperAdmin: {IsSuperAdmin()}");
            
            // If teamId is explicitly provided, use it (overrides JWT-based filtering)
            if (teamId.HasValue)
            {
                Console.WriteLine($"[EmployeeRepository] Filtering by provided teamId: {teamId.Value}");
                query = query.Where(e => e.TeamId == teamId.Value);
                
                // Log team distribution before filtering
                var teamDistribution = await _dbSet
                    .GroupBy(e => e.TeamId)
                    .Select(g => new { TeamId = g.Key, Count = g.Count() })
                    .ToListAsync();
                Console.WriteLine($"[EmployeeRepository] Team distribution: {string.Join(", ", teamDistribution.Select(t => $"TeamId {t.TeamId}: {t.Count}"))}");
            }
            // Otherwise, apply team filtering based on JWT claims if not Super Admin
            else if (!IsSuperAdmin())
            {
                var jwtTeamId = GetCurrentUserTeamId();
                Console.WriteLine($"[EmployeeRepository] JWT TeamId: {jwtTeamId?.ToString() ?? "null"}");
                if (jwtTeamId.HasValue)
                {
                    query = query.Where(e => e.TeamId == jwtTeamId.Value);
                }
            }
            
            var result = await query.ToListAsync();
            Console.WriteLine($"[EmployeeRepository] Returning {result.Count} employees");
            
            return result;
        }

        public async Task<Employee?> GetEmployeeWithDetailsByIdAsync(int id)
        {
            var query = _dbSet
                .Include(e => e.Type)
                .Include(e => e.User)
                .Include(e => e.Team)
                .AsQueryable();
                
            // Apply team filtering if not Super Admin
            if (!IsSuperAdmin())
            {
                var teamId = GetCurrentUserTeamId();
                if (teamId.HasValue)
                {
                    query = query.Where(e => e.TeamId == teamId.Value);
                }
            }
            
            return await query.FirstOrDefaultAsync(e => e.Id == id);
        }

        public override async Task<Employee?> GetByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}

