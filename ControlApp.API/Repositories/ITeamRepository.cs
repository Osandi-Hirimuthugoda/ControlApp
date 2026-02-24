using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public interface ITeamRepository
    {
        Task<IEnumerable<Team>> GetAllTeamsAsync();
        Task<Team?> GetTeamByIdAsync(int teamId);
        Task<Team?> GetTeamByCodeAsync(string teamCode);
        Task<Team> CreateTeamAsync(Team team);
        Task<Team> UpdateTeamAsync(Team team);
        Task<bool> DeleteTeamAsync(int teamId);
        Task<bool> TeamExistsAsync(int teamId);
        Task<bool> TeamCodeExistsAsync(string teamCode);
        Task<IEnumerable<Team>> GetTeamsByUserIdAsync(int userId);
    }
}
