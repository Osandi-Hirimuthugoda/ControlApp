using Microsoft.EntityFrameworkCore;
using ControlApp.API;
using ControlApp.API.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ControlApp.API.Repositories
{
    // Repositories/ControlRepository.cs - Specific Implementation 
    public class ControlRepository : Repository<Controls>, IControlRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public ControlRepository(AppDbContext context, IHttpContextAccessor httpContextAccessor) : base(context)
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

        public async Task<IEnumerable<Controls>> GetControlsWithDetailsAsync(string? searchTerm = null)
        {
            var query = _dbSet
                .Include(c => c.Type)
                .Include(c => c.Employee)
                .Include(c => c.QAEmployee)
                .Include(c => c.Status)
                .Include(c => c.Release)
                .Include(c => c.Team)
                .AsQueryable();

            // NOTE: Team filtering is handled in the Service layer based on query parameters
            // Repository should return all data and let Service filter by teamId parameter
            // This allows Super Admin to see all teams and regular users to filter by their team
            
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
            var query = _dbSet
                .Include(c => c.Type)
                .Include(c => c.Employee)
                .Include(c => c.QAEmployee)
                .Include(c => c.Status)
                .Include(c => c.Release)
                .Include(c => c.Team)
                .AsQueryable();
                
            // NOTE: Team filtering for single control is handled in Service layer
            // Repository returns the control if it exists, Service checks permissions
            
            return await query.FirstOrDefaultAsync(c => c.ControlId == id);
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