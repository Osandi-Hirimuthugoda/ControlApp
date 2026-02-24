using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InsightsController : ControllerBase
    {
        private readonly IInsightService _insightService;
        private readonly ILogger<InsightsController> _logger;

        public InsightsController(IInsightService insightService, ILogger<InsightsController> logger)
        {
            _insightService = insightService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InsightDto>>> GetAllInsights([FromQuery] bool activeOnly = true)
        {
            try
            {
                var insights = activeOnly 
                    ? await _insightService.GetActiveInsightsAsync()
                    : await _insightService.GetAllInsightsAsync();
                return Ok(insights);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting insights");
                return StatusCode(500, new { message = "Error getting insights" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InsightDto>> GetInsightById(int id)
        {
            try
            {
                var insight = await _insightService.GetInsightByIdAsync(id);
                if (insight == null)
                {
                    return NotFound(new { message = $"Insight with ID {id} not found" });
                }
                return Ok(insight);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting insight {InsightId}", id);
                return StatusCode(500, new { message = "Error getting insight" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<InsightDto>> CreateInsight([FromBody] CreateInsightDto createInsightDto)
        {
            try
            {
                var insight = await _insightService.CreateInsightAsync(createInsightDto);
                return CreatedAtAction(nameof(GetInsightById), new { id = insight.InsightId }, insight);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating insight");
                return StatusCode(500, new { message = "Error creating insight" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<InsightDto>> UpdateInsight(int id, [FromBody] UpdateInsightDto updateInsightDto)
        {
            try
            {
                if (id != updateInsightDto.InsightId)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                var insight = await _insightService.UpdateInsightAsync(id, updateInsightDto);
                if (insight == null)
                {
                    return NotFound(new { message = $"Insight with ID {id} not found" });
                }

                return Ok(insight);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating insight {InsightId}", id);
                return StatusCode(500, new { message = "Error updating insight" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInsight(int id)
        {
            try
            {
                var result = await _insightService.DeleteInsightAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Insight with ID {id} not found" });
                }

                return Ok(new { message = "Insight deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting insight {InsightId}", id);
                return StatusCode(500, new { message = "Error deleting insight" });
            }
        }

        [HttpPatch("{id}/toggle-active")]
        public async Task<ActionResult> ToggleInsightActive(int id)
        {
            try
            {
                var result = await _insightService.ToggleInsightActiveAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Insight with ID {id} not found" });
                }

                return Ok(new { message = "Insight status toggled successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling insight active status {InsightId}", id);
                return StatusCode(500, new { message = "Error toggling insight status" });
            }
        }

        [HttpPatch("{id}/toggle-pinned")]
        public async Task<ActionResult> ToggleInsightPinned(int id)
        {
            try
            {
                var result = await _insightService.ToggleInsightPinnedAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Insight with ID {id} not found" });
                }

                return Ok(new { message = "Insight pinned status toggled successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling insight pinned status {InsightId}", id);
                return StatusCode(500, new { message = "Error toggling insight pinned status" });
            }
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<InsightDto>>> GetInsightsByCategory(string category)
        {
            try
            {
                var insights = await _insightService.GetInsightsByCategoryAsync(category);
                return Ok(insights);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting insights by category {Category}", category);
                return StatusCode(500, new { message = "Error getting insights by category" });
            }
        }

        [HttpGet("author/{authorId}")]
        public async Task<ActionResult<IEnumerable<InsightDto>>> GetInsightsByAuthor(int authorId)
        {
            try
            {
                var insights = await _insightService.GetInsightsByAuthorAsync(authorId);
                return Ok(insights);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting insights by author {AuthorId}", authorId);
                return StatusCode(500, new { message = "Error getting insights by author" });
            }
        }

        [HttpGet("pinned")]
        public async Task<ActionResult<IEnumerable<InsightDto>>> GetPinnedInsights()
        {
            try
            {
                var insights = await _insightService.GetPinnedInsightsAsync();
                return Ok(insights);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pinned insights");
                return StatusCode(500, new { message = "Error getting pinned insights" });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<InsightDto>>> SearchInsights([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Search term is required" });
                }

                var insights = await _insightService.SearchInsightsAsync(searchTerm);
                return Ok(insights);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching insights");
                return StatusCode(500, new { message = "Error searching insights" });
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<InsightSummaryDto>> GetInsightSummary()
        {
            try
            {
                var summary = await _insightService.GetInsightSummaryAsync();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting insight summary");
                return StatusCode(500, new { message = "Error getting insight summary" });
            }
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            try
            {
                var categories = await _insightService.GetCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(500, new { message = "Error getting categories" });
            }
        }
    }
}