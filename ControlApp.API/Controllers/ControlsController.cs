using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControlApp.API.DTOs;
using ControlApp.API.Services;
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

        public ControlsController(IControlService controlService, AppDbContext context)// dependency 
        {
            _controlService = controlService;
            _context = context;
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

                var control = await _controlService.CreateControlAsync(createControlDto);
                
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
        // Admin, Team Lead, and Software Architecturer can update controls
        [Authorize(Roles = "Admin, Team Lead, Software Architecturer")]
        public async Task<ActionResult<ControlDto>> UpdateControl(int id, [FromBody] UpdateControlDto updateControlDto)
        {
            try
            {
                if (updateControlDto == null)
                    return BadRequest("Request body is required");

                if (id != updateControlDto.ControlId)
                    return BadRequest($"Control ID mismatch. URL ID: {id}, Body ID: {updateControlDto.ControlId}");

                var control = await _controlService.UpdateControlAsync(id, updateControlDto);
                if (control == null)
                    return NotFound($"Control with ID {id} not found.");

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