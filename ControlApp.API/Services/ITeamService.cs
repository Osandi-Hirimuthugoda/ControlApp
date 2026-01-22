using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface ITeamService
    {
        Task<IEnumerable<TeamDto>> GetAllTeamsAsync();
        Task<TeamDto?> GetTeamByIdAsync(int teamId);
        Task<TeamDto> CreateTeamAsync(CreateTeamDto createTeamDto);
        Task<TeamDto> UpdateTeamAsync(int teamId, UpdateTeamDto updateTeamDto);
        Task<bool> DeleteTeamAsync(int teamId);
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<TeamDto>> GetTeamsByUserIdAsync(int userId);
        Task<bool> AddUserToTeamAsync(int userId, int teamId);
        Task<bool> RemoveUserFromTeamAsync(int userId, int teamId);
        Task<IEnumerable<object>> GetTeamMembersAsync(int teamId);
    }
}
