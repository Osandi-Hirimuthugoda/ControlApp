using ControlApp.API.DTOs;
using ControlApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ControlApp.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamService _teamService;
        private readonly ILogger<TeamsController> _logger;

        public TeamsController(ITeamService teamService, ILogger<TeamsController> logger)
        {
            _teamService = teamService;
            _logger = logger;
        }

        // GET: api/teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamDto>>> GetAllTeams()
        {
            try
            {
                var teams = await _teamService.GetAllTeamsAsync();
                return Ok(teams);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teams");
                return StatusCode(500, "Error retrieving teams");
            }
        }

        // GET: api/teams/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TeamDto>>> GetTeamsByUserId(int userId)
        {
            try
            {
                var teams = await _teamService.GetTeamsByUserIdAsync(userId);
                return Ok(teams);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teams for user {UserId}", userId);
                return StatusCode(500, "Error retrieving teams");
            }
        }

        // GET: api/teams/dashboard-stats
        [HttpGet("dashboard-stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            try
            {
                var stats = await _teamService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard stats");
                return StatusCode(500, "Error retrieving dashboard stats");
            }
        }

        // GET: api/teams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDto>> GetTeam(int id)
        {
            try
            {
                var team = await _teamService.GetTeamByIdAsync(id);
                if (team == null)
                {
                    return NotFound($"Team with ID {id} not found");
                }
                return Ok(team);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving team {TeamId}", id);
                return StatusCode(500, "Error retrieving team");
            }
        }

        // POST: api/teams
        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<TeamDto>> CreateTeam([FromBody] CreateTeamDto createTeamDto)
        {
            try
            {
                var team = await _teamService.CreateTeamAsync(createTeamDto);
                return CreatedAtAction(nameof(GetTeam), new { id = team.TeamId }, team);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating team");
                return StatusCode(500, "Error creating team");
            }
        }

        // PUT: api/teams/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<TeamDto>> UpdateTeam(int id, [FromBody] UpdateTeamDto updateTeamDto)
        {
            try
            {
                var team = await _teamService.UpdateTeamAsync(id, updateTeamDto);
                return Ok(team);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating team {TeamId}", id);
                return StatusCode(500, "Error updating team");
            }
        }

        // DELETE: api/teams/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> DeleteTeam(int id)
        {
            try
            {
                var result = await _teamService.DeleteTeamAsync(id);
                if (!result)
                {
                    return NotFound($"Team with ID {id} not found");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting team {TeamId}", id);
                return StatusCode(500, "Error deleting team");
            }
        }

        // POST: api/teams/{teamId}/members/{userId}
        [HttpPost("{teamId}/members/{userId}")]
        [Authorize]
        public async Task<ActionResult> AddUserToTeam(int teamId, int userId)
        {
            try
            {
                var result = await _teamService.AddUserToTeamAsync(userId, teamId);
                if (!result) return BadRequest("Could not add user to team");
                return Ok(new { message = "User added to team" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding user {UserId} to team {TeamId}", userId, teamId);
                return StatusCode(500, "Error adding user to team");
            }
        }

        // DELETE: api/teams/{teamId}/members/{userId}
        [HttpDelete("{teamId}/members/{userId}")]
        [Authorize]
        public async Task<ActionResult> RemoveUserFromTeam(int teamId, int userId)
        {
            try
            {
                var result = await _teamService.RemoveUserFromTeamAsync(userId, teamId);
                if (!result) return BadRequest("Could not remove user from team");
                return Ok(new { message = "User removed from team" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing user {UserId} from team {TeamId}", userId, teamId);
                return StatusCode(500, "Error removing user from team");
            }
        }

        // GET: api/teams/{teamId}/members
        [HttpGet("{teamId}/members")]
        [Authorize]
        public async Task<ActionResult> GetTeamMembers(int teamId)
        {
            try
            {
                var members = await _teamService.GetTeamMembersAsync(teamId);
                return Ok(members);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting members for team {TeamId}", teamId);
                return StatusCode(500, "Error getting team members");
            }
        }
    }
}
