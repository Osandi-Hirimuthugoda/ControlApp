using Microsoft.AspNetCore.Mvc;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ControlsController : ControllerBase
    {
        private readonly IControlService _controlService;

        public ControlsController(IControlService controlService)
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
        public async Task<ActionResult<ControlDto>> CreateControl([FromBody] CreateControlDto createControlDto)
        {
            try
            {
                var control = await _controlService.CreateControlAsync(createControlDto);
                return CreatedAtAction(nameof(GetControlById), new { id = control.ControlId }, control);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ControlDto>> UpdateControl(int id, [FromBody] UpdateControlDto updateControlDto)
        {
            try
            {
                if (id != updateControlDto.ControlId)
                    return BadRequest("Control ID mismatch");

                var control = await _controlService.UpdateControlAsync(id, updateControlDto);
                if (control == null)
                    return NotFound($"Control with ID {id} not found.");

                return Ok(control);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating control: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteControl(int id)
        {
            var deleted = await _controlService.DeleteControlAsync(id);
            if (!deleted)
                return NotFound($"Control with ID {id} not found.");

            return NoContent();
        }

        [HttpPost("add-all-employees")]
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