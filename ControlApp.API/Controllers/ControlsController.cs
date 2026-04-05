using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ControlApp.API.DTOs;
using ControlApp.API.Services;
using ControlApp.API.Hubs;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ControlsController : ControllerBase //inherit 
    {
        private readonly IControlService _controlService;
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ControlsController(IControlService controlService, AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _controlService = controlService;
            _context = context;
            _hubContext = hubContext;
        }

         
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ControlDto>>> GetAllControls([FromQuery] string? search = null, [FromQuery] int? teamId = null)
        {
            try
            {
                var isSuperAdmin = User.Claims.FirstOrDefault(c => c.Type == "IsSuperAdmin")?.Value == "True";
                
                // Determine which teams to show
                int? filterTeamId = null;
                
                if (teamId.HasValue)
                {
                    // Explicit teamId provided (from team dropdown selection)
                    filterTeamId = teamId.Value;
                }
                else if (!isSuperAdmin)
                {
                    // For non-Super Admin users without explicit teamId:
                    // Show all their teams' data (Project Managers can see all their teams)
                    // Pass null to service to get all controls, then filter by user's teams
                    filterTeamId = null; // Will be handled by checking user's teams
                }
                
                var controls = await _controlService.GetAllControlsAsync(search, filterTeamId);
                
                // If no specific team selected and not Super Admin, filter by user's accessible teams
                if (!teamId.HasValue && !isSuperAdmin)
                {
                    // Get user's team IDs from JWT claims or database
                    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
                    if (int.TryParse(userIdClaim, out int userId))
                    {
                        // Get user's teams from database
                        var user = await _context.Users
                            .Include(u => u.UserTeams)
                            .FirstOrDefaultAsync(u => u.Id == userId);
                        
                        if (user != null && user.UserTeams.Any())
                        {
                            var userTeamIds = user.UserTeams
                                .Where(ut => ut.IsActive)
                                .Select(ut => ut.TeamId)
                                .ToList();
                            
                            // Filter controls to only show user's teams
                            controls = controls.Where(c => c.TeamId.HasValue && userTeamIds.Contains(c.TeamId.Value));
                        }
                    }
                }
                
                return Ok(controls);
            }
            catch (Exception ex)
            {
                var logger = HttpContext.RequestServices.GetRequiredService<ILogger<ControlsController>>();
                logger.LogError(ex, "Error getting all controls: {Message}. Inner Exception: {InnerException}. Stack Trace: {StackTrace}", 
                    ex.Message, 
                    ex.InnerException?.Message ?? "None", 
                    ex.StackTrace ?? "None");
                
                var errorMessage = ex.Message;
                if (ex.InnerException != null)
                {
                    errorMessage += $" Inner Exception: {ex.InnerException.Message}";
                }
                
                return StatusCode(500, new { message = $"Error getting controls: {errorMessage}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ControlDto>> GetControlById(int id)
        {
            var control = await _controlService.GetControlByIdAsync(id);
            if (control == null)
                return NotFound($"Control with ID {id} not found.");

            return Ok(control);
        }

        [HttpPost]
        // All authenticated users (except view-only roles) can create controls
        [Authorize]
        public async Task<ActionResult<ControlDto>> CreateControl([FromBody] CreateControlDto createControlDto)
        {
            try
            {
                if (createControlDto == null)
                {
                    return BadRequest(new { message = "Request body is required" });
                }

                var logger = HttpContext.RequestServices.GetRequiredService<ILogger<ControlsController>>();
                logger.LogInformation("Creating control with TypeId: {TypeId}, EmployeeId: {EmployeeId}, Description: {Description}", 
                    createControlDto.TypeId, createControlDto.EmployeeId, createControlDto.Description);

                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                var employees = await _context.Employees.ToListAsync();
                var performer = employees.FirstOrDefault(e => e.UserId == userId);

                var control = await _controlService.CreateControlAsync(createControlDto, performer?.Id);
                
                logger.LogInformation("Control created successfully with ID: {ControlId}", control.ControlId);
                return CreatedAtAction(nameof(GetControlById), new { id = control.ControlId }, control);
            }
            catch (ArgumentException ex)
            {
                var logger = HttpContext.RequestServices.GetRequiredService<ILogger<ControlsController>>();
                logger.LogWarning("Validation error creating control: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                var logger = HttpContext.RequestServices.GetRequiredService<ILogger<ControlsController>>();
                logger.LogError(ex, "Error creating control: {Message}", ex.Message);
                return StatusCode(500, new { message = $"Error creating control: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ControlDto>> UpdateControl(int id, [FromBody] UpdateControlDto updateControlDto)
        {
            try
            {
                if (updateControlDto == null)
                    return BadRequest("Request body is required");

                if (id != updateControlDto.ControlId)
                    return BadRequest($"Control ID mismatch. URL ID: {id}, Body ID: {updateControlDto.ControlId}");

                // Team-scoped access: verify the control belongs to the user's team
                // Super Admin and Admin bypass this check
                var isSuperAdmin = User.Claims.FirstOrDefault(c => c.Type == "IsSuperAdmin")?.Value == "True";
                var userRole = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
                
                if (!isSuperAdmin && !string.Equals(userRole, "Admin", StringComparison.OrdinalIgnoreCase))
                {
                    var teamIdClaim = User.Claims.FirstOrDefault(c => c.Type == "TeamId")?.Value;
                    if (int.TryParse(teamIdClaim, out int userTeamId))
                    {
                        var existingControl = await _controlService.GetControlByIdAsync(id);
                        if (existingControl != null && existingControl.TeamId.HasValue && existingControl.TeamId.Value != userTeamId)
                        {
                            return Forbid(); // Cannot edit controls from other teams
                        }
                    }
                }

                var oldControl = await _controlService.GetControlByIdAsync(id);
                
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                var employees = await _context.Employees.ToListAsync();
                var performer = employees.FirstOrDefault(e => e.UserId == userId);
                
                var control = await _controlService.UpdateControlAsync(id, updateControlDto, performer?.Id);
                if (control == null)
                    return NotFound($"Control with ID {id} not found.");

                // Send SignalR notification if QA Engineer was newly assigned
                if (updateControlDto.QAEmployeeId.HasValue &&
                    (oldControl == null || oldControl.QAEmployeeId != updateControlDto.QAEmployeeId))
                {
                    try
                    {
                        var qaEmployee = await _context.Employees
                            .Include(e => e.User)
                            .FirstOrDefaultAsync(e => e.Id == updateControlDto.QAEmployeeId.Value);

                        if (qaEmployee?.UserId != null)
                        {
                            await _hubContext.Clients.User(qaEmployee.UserId.Value.ToString())
                                .SendAsync("QAAssigned", control.Description, control.ControlId);
                        }
                    }
                    catch (Exception signalREx)
                    {
                        Console.WriteLine($"Error sending QA assignment notification: {signalREx.Message}");
                    }
                }

                return Ok(control);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating control: {ex.Message}" });
            }
        }

        // GET: api/controls/{id}/activity
        [HttpGet("{id}/activity")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ActivityLogDto>>> GetActivityLogs(int id)
        {
            var logs = await _controlService.GetActivityLogsAsync(id);
            return Ok(logs);
        }

        // POST: api/controls/{id}/activity  — log a sub-description status change
        [HttpPost("{id}/activity")]
        [Authorize]
        public async Task<IActionResult> LogSubDescriptionActivity(int id, [FromBody] LogSubDescActivityDto dto)
        {
            try
            {
                var control = await _context.Controls.FirstOrDefaultAsync(c => c.ControlId == id);
                if (control == null) return NotFound();

                string? performerName = dto.PerformedByName;
                if (string.IsNullOrEmpty(performerName) && dto.PerformedByEmployeeId.HasValue)
                {
                    var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == dto.PerformedByEmployeeId.Value);
                    performerName = emp?.EmployeeName;
                }

                var log = new ControlApp.API.Models.ActivityLog
                {
                    EntityType = "SubDescription",
                    EntityId = id,
                    ControlId = id,
                    Action = "StatusChanged",
                    OldValue = dto.OldStatus,
                    NewValue = dto.NewStatus,
                    Description = $"Sub-objective '{dto.SubDescription}' status changed from '{dto.OldStatus}' to '{dto.NewStatus}'",
                    PerformedByEmployeeId = dto.PerformedByEmployeeId,
                    PerformedByName = performerName,
                    Timestamp = DateTime.UtcNow,
                    TeamId = control.TeamId ?? 0
                };

                _context.ActivityLogs.Add(log);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Activity logged" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error logging activity: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        // Admin, Team Lead, and Software Architecturer can delete controls
        [Authorize(Roles = "Admin, Team Lead, Software Architecturer")]
        public async Task<IActionResult> DeleteControl(int id)
        {
            var deleted = await _controlService.DeleteControlAsync(id);
            if (!deleted)
                return NotFound($"Control with ID {id} not found.");

            return NoContent();
        }

        [HttpPost("add-all-employees")]
        // Admin, Team Lead, and Software Architecturer can bulk-add controls
        [Authorize(Roles = "Admin, Team Lead, Software Architecturer")]
        public async Task<ActionResult<IEnumerable<ControlDto>>> AddAllEmployeesToControls()
        {
            try
            {
                var controls = await _controlService.AddAllEmployeesToControlsAsync();
                return Ok(controls);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding employees to controls: {ex.Message}");
            }
        }
    }
}