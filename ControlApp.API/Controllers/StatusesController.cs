using Microsoft.AspNetCore.Mvc;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatusesController : ControllerBase
    {
        private readonly IStatusService _statusService;

        public StatusesController(IStatusService statusService)
        {
            _statusService = statusService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StatusDto>>> GetAllStatuses()
        {
            var statuses = await _statusService.GetAllStatusesAsync();
            return Ok(statuses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StatusDto>> GetStatusById(int id)
        {
            var status = await _statusService.GetStatusByIdAsync(id);
            if (status == null)
                return NotFound($"Status with ID {id} not found.");

            return Ok(status);
        }

        [HttpPost]
        public async Task<ActionResult<StatusDto>> CreateStatus([FromBody] CreateStatusDto createStatusDto)
        {
            var status = await _statusService.CreateStatusAsync(createStatusDto);
            return CreatedAtAction(nameof(GetStatusById), new { id = status.Id }, status);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StatusDto>> UpdateStatus(int id, [FromBody] CreateStatusDto updateStatusDto)
        {
            var status = await _statusService.UpdateStatusAsync(id, updateStatusDto);
            if (status == null)
                return NotFound($"Status with ID {id} not found.");

            return Ok(status);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var deleted = await _statusService.DeleteStatusAsync(id);
            if (!deleted)
                return NotFound($"Status with ID {id} not found.");

            return NoContent();
        }
    }
}