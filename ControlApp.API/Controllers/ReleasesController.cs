using Microsoft.AspNetCore.Mvc;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<ActionResult<ReleaseDto>> CreateRelease([FromBody] CreateReleaseDto createReleaseDto)
        {
            var release = await _releaseService.CreateReleaseAsync(createReleaseDto);
            return CreatedAtAction(nameof(GetReleaseById), new { id = release.ReleaseId }, release);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ReleaseDto>> UpdateRelease(int id, [FromBody] CreateReleaseDto updateReleaseDto)
        {
            var release = await _releaseService.UpdateReleaseAsync(id, updateReleaseDto);
            if (release == null)
                return NotFound($"Release with ID {id} not found.");

            return Ok(release);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRelease(int id)
        {
            var deleted = await _releaseService.DeleteReleaseAsync(id);
            if (!deleted)
                return NotFound($"Release with ID {id} not found.");

            return NoContent();
        }
    }
}