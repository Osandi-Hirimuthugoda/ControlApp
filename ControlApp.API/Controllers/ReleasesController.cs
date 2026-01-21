using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReleasesController : ControllerBase
    {
        private readonly IReleaseService _releaseService;

        public ReleasesController(IReleaseService releaseService)
        {
            _releaseService = releaseService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReleaseDto>>> GetAllReleases()
        {
            var releases = await _releaseService.GetAllReleasesAsync();
            return Ok(releases);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReleaseDto>> GetReleaseById(int id)
        {
            var release = await _releaseService.GetReleaseByIdAsync(id);
            if (release == null)
                return NotFound($"Release with ID {id} not found.");

            return Ok(release);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ReleaseDto>> CreateRelease([FromBody] CreateReleaseDto createReleaseDto)
        {
            try
            {
                var release = await _releaseService.CreateReleaseAsync(createReleaseDto);
                return CreatedAtAction(nameof(GetReleaseById), new { id = release.ReleaseId }, release);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error creating release: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ReleaseDto>>UpdateRelease(int id, [FromBody] CreateReleaseDto updateReleaseDto)
        {
            try
            {
                var release = await _releaseService.UpdateReleaseAsync(id, updateReleaseDto);
                if (release == null)
                    return NotFound($"Release with ID {id} not found.");

                return Ok(release);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating release: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRelease(int id)
        {
            var deleted = await _releaseService.DeleteReleaseAsync(id);
            if (!deleted)
                return NotFound($"Release with ID {id} not found.");

            return NoContent();
        }
    }
}