using ControlApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        private readonly AppDbContext _context;

        public TeamRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Team>> GetAllTeamsAsync()
        {
            return await _context.Teams
                .Include(t => t.Architect)
                .Include(t => t.ProjectManager)
                .Include(t => t.TeamLead)
                .Where(t => t.IsActive)
                .OrderBy(t => t.TeamName)
                .ToListAsync();
        }

        public async Task<Team?> GetTeamByIdAsync(int teamId)
        {
            return await _context.Teams
                .Include(t => t.Architect)
                .Include(t => t.ProjectManager)
                .Include(t => t.TeamLead)
                .FirstOrDefaultAsync(t => t.TeamId == teamId);
        }

        public async Task<Team?> GetTeamByCodeAsync(string teamCode)
        {
            return await _context.Teams
                .FirstOrDefaultAsync(t => t.TeamCode == teamCode);
        }

        public async Task<Team> CreateTeamAsync(Team team)
        {
            team.CreatedAt = DateTime.Now;
            team.UpdatedAt = DateTime.Now;
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();
            return team;
        }

        public async Task<Team> UpdateTeamAsync(Team team)
        {
            team.UpdatedAt = DateTime.Now;
            _context.Teams.Update(team);
            await _context.SaveChangesAsync();
            return team;
        }

        public async Task<bool> DeleteTeamAsync(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return false;

            // Soft delete
            team.IsActive = false;
            team.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> TeamExistsAsync(int teamId)
        {
            return await _context.Teams.AnyAsync(t => t.TeamId == teamId);
        }

        public async Task<bool> TeamCodeExistsAsync(string teamCode)
        {
            return await _context.Teams.AnyAsync(t => t.TeamCode == teamCode);
        }

        public async Task<IEnumerable<Team>> GetTeamsByUserIdAsync(int userId)
        {
            return await _context.UserTeams
                .Where(ut => ut.UserId == userId)
                .Include(ut => ut.Team)
                    .ThenInclude(t => t.Architect)
                .Include(ut => ut.Team)
                    .ThenInclude(t => t.ProjectManager)
                .Include(ut => ut.Team)
                    .ThenInclude(t => t.TeamLead)
                .Select(ut => ut.Team)
                .Where(t => t.IsActive)
                .OrderBy(t => t.TeamName)
                .ToListAsync();
        }
    }
}
