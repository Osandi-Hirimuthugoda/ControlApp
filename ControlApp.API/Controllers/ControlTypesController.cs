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
        public async Task<ActionResult<IEnumerable<ControlTypeDto>>> GetAllControlTypes()
        {
            var controlTypes = await _controlTypeService.GetAllControlTypesAsync();
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
        // Allow Admin, Team Lead, and Software Architecture to add control types
        [Authorize(Roles = "Admin,Team Lead,Software Architecture")]
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
        // Allow Admin, Team Lead, and Software Architecture to update control types
        [Authorize(Roles = "Admin,Team Lead,Software Architecture")]
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
        // Allow Admin, Team Lead, and Software Architecture to delete control types
        [Authorize(Roles = "Admin,Team Lead,Software Architecture")]
        public async Task<IActionResult> DeleteControlType(int id)
        {
            var deleted = await _controlTypeService.DeleteControlTypeAsync(id);
            if (!deleted)
                return NotFound($"ControlType with ID {id} not found.");

            return NoContent();
        }
    }
}