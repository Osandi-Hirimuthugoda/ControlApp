using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControlApp.API.DTOs;
using ControlApp.API.Services;
using System.Security.Claims;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProgressLogController : ControllerBase
    {
        private readonly IProgressLogService _progressLogService;
        private readonly ILogger<ProgressLogController> _logger;

        public ProgressLogController(IProgressLogService progressLogService, ILogger<ProgressLogController> logger)
        {
            _progressLogService = progressLogService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<ProgressLogDto>> CreateProgressLog([FromBody] CreateProgressLogDto createProgressLogDto)
        {
            try
            {
                var progressLog = await _progressLogService.CreateProgressLogAsync(createProgressLogDto);
                return CreatedAtAction(nameof(GetProgressLogsByControlId), new { controlId = progressLog.ControlId }, progressLog);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating progress log");
                return StatusCode(500, new { message = "Error creating progress log" });
            }
        }

        [HttpGet("control/{controlId}")]
        public async Task<ActionResult<IEnumerable<ProgressLogDto>>> GetProgressLogsByControlId(int controlId)
        {
            try
            {
                var progressLogs = await _progressLogService.GetProgressLogsByControlIdAsync(controlId);
                return Ok(progressLogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting progress logs for control {ControlId}", controlId);
                return StatusCode(500, new { message = "Error getting progress logs" });
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<ProgressLogDto>>> GetProgressLogsByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            try
            {
                var progressLogs = await _progressLogService.GetProgressLogsByDateRangeAsync(startDate, endDate);
                return Ok(progressLogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting progress logs for date range {StartDate} to {EndDate}", startDate, endDate);
                return StatusCode(500, new { message = "Error getting progress logs" });
            }
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<ProgressLogDto>>> GetProgressLogsByEmployeeId(
            int employeeId,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var progressLogs = await _progressLogService.GetProgressLogsByEmployeeIdAsync(employeeId, startDate, endDate);
                return Ok(progressLogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting progress logs for employee {EmployeeId}", employeeId);
                return StatusCode(500, new { message = "Error getting progress logs" });
            }
        }

        [HttpGet("daily-summary")]
        public async Task<ActionResult<DailyProgressSummaryDto>> GetDailyProgressSummary(
            [FromQuery] DateTime date,
            [FromQuery] int? teamId = null)
        {
            try
            {
                var summary = await _progressLogService.GetDailyProgressSummaryAsync(date, teamId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting daily progress summary for {Date}", date);
                return StatusCode(500, new { message = "Error getting daily progress summary" });
            }
        }

        [HttpGet("weekly-summary")]
        public async Task<ActionResult<IEnumerable<DailyProgressSummaryDto>>> GetWeeklyProgressSummary(
            [FromQuery] DateTime startDate,
            [FromQuery] int? teamId = null)
        {
            try
            {
                var summaries = await _progressLogService.GetWeeklyProgressSummaryAsync(startDate, teamId);
                return Ok(summaries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting weekly progress summary for week starting {StartDate}", startDate);
                return StatusCode(500, new { message = "Error getting weekly progress summary" });
            }
        }

        [HttpGet("latest/{controlId}")]
        public async Task<ActionResult<ProgressLogDto>> GetLatestProgressLogForControl(int controlId)
        {
            try
            {
                var progressLog = await _progressLogService.GetLatestProgressLogForControlAsync(controlId);
                if (progressLog == null)
                {
                    return NotFound(new { message = $"No progress logs found for control {controlId}" });
                }
                return Ok(progressLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting latest progress log for control {ControlId}", controlId);
                return StatusCode(500, new { message = "Error getting latest progress log" });
            }
        }

        [HttpPost("log-daily/{controlId}")]
        public async Task<ActionResult> LogDailyProgress(
            int controlId,
            [FromBody] LogDailyProgressRequest request)
        {
            try
            {
                var success = await _progressLogService.LogDailyProgressAsync(
                    controlId, 
                    request.Progress, 
                    request.Comments, 
                    request.WorkDescription);

                if (success)
                {
                    return Ok(new { message = "Daily progress logged successfully" });
                }
                else
                {
                    return Conflict(new { message = "Progress already logged for today" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging daily progress for control {ControlId}", controlId);
                return StatusCode(500, new { message = "Error logging daily progress" });
            }
        }
    }

    public class LogDailyProgressRequest
    {
        public int Progress { get; set; }
        public string? Comments { get; set; }
        public string? WorkDescription { get; set; }
    }
}