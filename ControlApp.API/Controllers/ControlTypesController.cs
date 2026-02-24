using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ControlTypesController : ControllerBase
    {
        private readonly IControlTypeService _controlTypeService;

        public ControlTypesController(IControlTypeService controlTypeService)
        {
            _controlTypeService = controlTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ControlTypeDto>>> GetAllControlTypes([FromQuery] int? teamId = null)
        {
            // IMPORTANT: If teamId is explicitly provided in query parameter, use it
            // This allows team switching without requiring JWT token refresh
            // Only use JWT claims if teamId is NOT provided
            if (!teamId.HasValue)
            {
                var isSuperAdmin = User.Claims.FirstOrDefault(c => c.Type == "IsSuperAdmin")?.Value == "True";
                var userTeamIdClaim = User.Claims.FirstOrDefault(c => c.Type == "TeamId")?.Value;
                
                // If teamId is not provided and user is not Super Admin, use user's team from JWT
                if (!isSuperAdmin && int.TryParse(userTeamIdClaim, out int userTeamId))
                {
                    teamId = userTeamId;
                }
            }
            
            var controlTypes = await _controlTypeService.GetAllControlTypesAsync(teamId);
            return Ok(controlTypes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ControlTypeDto>> GetControlTypeById(int id)
        {
            var controlType = await _controlTypeService.GetControlTypeByIdAsync(id);
            if (controlType == null)
                return NotFound($"ControlType with ID {id} not found.");

            return Ok(controlType);
        }

        [HttpPost]
        // Allow Admin, Project Manager, Team Lead, Software Architecture, and Super Admin to add control types
        [Authorize(Roles = "Admin,Project Manager,Team Lead,Software Architecture,Software Architecturer,Super Admin")]
        public async Task<ActionResult<ControlTypeDto>> CreateControlType([FromBody] CreateControlTypeDto createControlTypeDto)
        {
            try
            {
                var controlType = await _controlTypeService.CreateControlTypeAsync(createControlTypeDto);
                return CreatedAtAction(nameof(GetControlTypeById), new { id = controlType.ControlTypeId }, controlType);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        // Allow Admin, Project Manager, Team Lead, Software Architecture, and Super Admin to update control types
        [Authorize(Roles = "Admin,Project Manager,Team Lead,Software Architecture,Software Architecturer,Super Admin")]
        public async Task<ActionResult<ControlTypeDto>> UpdateControlType(int id, [FromBody] CreateControlTypeDto updateControlTypeDto)
        {
            try
            {
                var controlType = await _controlTypeService.UpdateControlTypeAsync(id, updateControlTypeDto);
                if (controlType == null)
                    return NotFound($"ControlType with ID {id} not found.");

                return Ok(controlType);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        // Allow Admin, Project Manager, Team Lead, Software Architecture, and Super Admin to delete control types
        [Authorize(Roles = "Admin,Project Manager,Team Lead,Software Architecture,Software Architecturer,Super Admin")]
        public async Task<IActionResult> DeleteControlType(int id)
        {
            var deleted = await _controlTypeService.DeleteControlTypeAsync(id);
            if (!deleted)
                return NotFound($"ControlType with ID {id} not found.");

            return NoContent();
        }
    }
}