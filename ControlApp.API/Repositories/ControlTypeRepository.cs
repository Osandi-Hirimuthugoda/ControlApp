using ControlApp.API;
using ControlApp.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace ControlApp.API.Repositories
{
    public class ControlTypeRepository : Repository<ControlType>, IControlTypeRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public ControlTypeRepository(AppDbContext context, IHttpContextAccessor httpContextAccessor) : base(context)
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
        
        public override async Task<IEnumerable<ControlType>> GetAllAsync()
        {
            var query = _dbSet.AsQueryable();
            
            // Apply team filtering if not Super Admin
            if (!IsSuperAdmin())
            {
                var teamId = GetCurrentUserTeamId();
                if (teamId.HasValue)
                {
                    query = query.Where(ct => ct.TeamId == teamId.Value);
                }
            }
            
            return await query.ToListAsync();
        }
    }
}

