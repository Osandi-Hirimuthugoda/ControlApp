using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Services
{
    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _teamRepository;
        private readonly AppDbContext _context;

        public TeamService(ITeamRepository teamRepository, AppDbContext context)
        {
            _teamRepository = teamRepository;
            _context = context;
        }

        public async Task<IEnumerable<TeamDto>> GetAllTeamsAsync()
        {
            var teams = await _teamRepository.GetAllTeamsAsync();
            return teams.Select(t => MapToDto(t));
        }

        public async Task<TeamDto?> GetTeamByIdAsync(int teamId)
        {
            var team = await _teamRepository.GetTeamByIdAsync(teamId);
            return team == null ? null : MapToDto(team);
        }

        public async Task<TeamDto> CreateTeamAsync(CreateTeamDto createTeamDto)
        {
            // Check if team code already exists
            if (await _teamRepository.TeamCodeExistsAsync(createTeamDto.TeamCode))
            {
                throw new InvalidOperationException($"Team code '{createTeamDto.TeamCode}' already exists");
            }

            var team = new Team
            {
                TeamName = createTeamDto.TeamName,
                TeamCode = createTeamDto.TeamCode,
                Description = createTeamDto.Description,
                IsActive = true,
                ArchitectId = createTeamDto.ArchitectId,
                ProjectManagerId = createTeamDto.ProjectManagerId,
                TeamLeadId = createTeamDto.TeamLeadId
            };

            var createdTeam = await _teamRepository.CreateTeamAsync(team);
            return MapToDto(createdTeam);
        }

        public async Task<TeamDto> UpdateTeamAsync(int teamId, UpdateTeamDto updateTeamDto)
        {
            var team = await _teamRepository.GetTeamByIdAsync(teamId);
            if (team == null)
            {
                throw new KeyNotFoundException($"Team with ID {teamId} not found");
            }

            team.TeamName = updateTeamDto.TeamName;
            team.Description = updateTeamDto.Description;
            team.IsActive = updateTeamDto.IsActive;
            team.ArchitectId = updateTeamDto.ArchitectId;
            team.ProjectManagerId = updateTeamDto.ProjectManagerId;
            team.TeamLeadId = updateTeamDto.TeamLeadId;

            var updatedTeam = await _teamRepository.UpdateTeamAsync(team);
            return MapToDto(updatedTeam);
        }

        public async Task<bool> DeleteTeamAsync(int teamId)
        {
            return await _teamRepository.DeleteTeamAsync(teamId);
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var teams = await _teamRepository.GetAllTeamsAsync();
            var teamStats = new List<TeamStatsDto>();

            foreach (var team in teams)
            {
                var controls = await _context.Controls
                    .Where(c => c.TeamId == team.TeamId)
                    .ToListAsync();

                var employees = await _context.Employees
                    .Where(e => e.TeamId == team.TeamId)
                    .CountAsync();

                var controlTypes = await _context.ControlTypes
                    .Where(ct => ct.TeamId == team.TeamId)
                    .CountAsync();

                var completedControls = controls.Count(c => c.Progress >= 100);
                var inProgressControls = controls.Count(c => c.Progress > 0 && c.Progress < 100);
                var notStartedControls = controls.Count(c => c.Progress == 0);

                var completionPercentage = controls.Any() 
                    ? Math.Round((double)completedControls / controls.Count * 100, 2)
                    : 0;

                teamStats.Add(new TeamStatsDto
                {
                    TeamId = team.TeamId,
                    TeamName = team.TeamName,
                    TeamCode = team.TeamCode,
                    TotalControls = controls.Count,
                    CompletedControls = completedControls,
                    InProgressControls = inProgressControls,
                    NotStartedControls = notStartedControls,
                    TotalEmployees = employees,
                    TotalControlTypes = controlTypes,
                    CompletionPercentage = completionPercentage
                });
            }

            var totalControls = teamStats.Sum(t => t.TotalControls);
            var totalCompleted = teamStats.Sum(t => t.CompletedControls);
            var overallCompletion = totalControls > 0 
                ? Math.Round((double)totalCompleted / totalControls * 100, 2)
                : 0;

            return new DashboardStatsDto
            {
                TeamStats = teamStats,
                TotalTeams = teams.Count(),
                TotalControls = totalControls,
                TotalEmployees = teamStats.Sum(t => t.TotalEmployees),
                OverallCompletionPercentage = overallCompletion
            };
        }

        public async Task<IEnumerable<TeamDto>> GetTeamsByUserIdAsync(int userId)
        {
            var teams = await _teamRepository.GetTeamsByUserIdAsync(userId);
            return teams.Select(t => MapToDto(t));
        }

        private TeamDto MapToDto(Team team)
        {
            return new TeamDto
            {
                TeamId = team.TeamId,
                TeamName = team.TeamName,
                TeamCode = team.TeamCode,
                Description = team.Description,
                IsActive = team.IsActive,
                CreatedAt = team.CreatedAt,
                UpdatedAt = team.UpdatedAt,
                ArchitectId = team.ArchitectId,
                ArchitectName = team.Architect?.EmployeeName,
                ProjectManagerId = team.ProjectManagerId,
                ProjectManagerName = team.ProjectManager?.EmployeeName,
                TeamLeadId = team.TeamLeadId,
                TeamLeadName = team.TeamLead?.EmployeeName
            };
        }
    }
}
