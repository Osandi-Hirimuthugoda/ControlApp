using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ControlsController : ControllerBase //inherit 
    {
        private readonly IControlService _controlService;

        public ControlsController(IControlService controlService)// dependency 
        {
            _controlService = controlService;
        }

         
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ControlDto>>> GetAllControls([FromQuery] string? search = null)
        {
            
            var controls = await _controlService.GetAllControlsAsync(search);
            return Ok(controls);
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
        // Admin, Team Lead, and Software Architecturer can create controls
        [Authorize(Roles = "Admin, Team Lead, Software Architecturer")]
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