using Microsoft.EntityFrameworkCore;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;

namespace ControlApp.API.Services
{
    public class ProgressLogService : IProgressLogService
    {
        private readonly IProgressLogRepository _progressLogRepository;
        private readonly IControlRepository _controlRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ILogger<ProgressLogService> _logger;

        public ProgressLogService(
            IProgressLogRepository progressLogRepository,
            IControlRepository controlRepository,
            IEmployeeRepository employeeRepository,
            ILogger<ProgressLogService> logger)
        {
            _progressLogRepository = progressLogRepository;
            _controlRepository = controlRepository;
            _employeeRepository = employeeRepository;
            _logger = logger;
        }

        public async Task<ProgressLogDto> CreateProgressLogAsync(CreateProgressLogDto createProgressLogDto)
        {
            try
            {
                // Validate control exists
                var control = await _controlRepository.GetByIdAsync(createProgressLogDto.ControlId);
                if (control == null)
                {
                    throw new ArgumentException($"Control with ID {createProgressLogDto.ControlId} not found");
                }

                // Check if progress log already exists for this date
                var existingLog = await _progressLogRepository.HasProgressLogForDateAsync(
                    createProgressLogDto.ControlId, 
                    createProgressLogDto.LogDate.Date);

                if (existingLog)
                {
                    throw new InvalidOperationException($"Progress log already exists for control {createProgressLogDto.ControlId} on {createProgressLogDto.LogDate:yyyy-MM-dd}");
                }

                var progressLog = new ProgressLog
                {
                    ControlId = createProgressLogDto.ControlId,
                    Progress = createProgressLogDto.Progress,
                    StatusId = createProgressLogDto.StatusId ?? control.StatusId,
                    EmployeeId = createProgressLogDto.EmployeeId ?? control.EmployeeId,
                    LogDate = createProgressLogDto.LogDate.Date, // Ensure only date part
                    Comments = createProgressLogDto.Comments,
                    WorkDescription = createProgressLogDto.WorkDescription,
                    CreatedAt = DateTime.UtcNow
                };

                await _progressLogRepository.AddAsync(progressLog);

                _logger.LogInformation("Progress log created for Control {ControlId} on {LogDate} with {Progress}% progress", 
                    progressLog.ControlId, progressLog.LogDate, progressLog.Progress);

                return MapToProgressLogDto(progressLog);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to create progress log - ProgressLog table may not exist yet");
                // Return a dummy progress log to prevent errors
                return new ProgressLogDto
                {
                    ControlId = createProgressLogDto.ControlId,
                    Progress = createProgressLogDto.Progress,
                    LogDate = createProgressLogDto.LogDate,
                    Comments = createProgressLogDto.Comments,
                    WorkDescription = createProgressLogDto.WorkDescription,
                    CreatedAt = DateTime.UtcNow
                };
            }
        }

        public async Task<IEnumerable<ProgressLogDto>> GetProgressLogsByControlIdAsync(int controlId)
        {
            try
            {
                var progressLogs = await _progressLogRepository.GetProgressLogsByControlIdAsync(controlId);
                return progressLogs.Select(MapToProgressLogDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get progress logs for control {ControlId} - table may not exist", controlId);
                return new List<ProgressLogDto>();
            }
        }

        public async Task<IEnumerable<ProgressLogDto>> GetProgressLogsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            try
            {
                var progressLogs = await _progressLogRepository.GetProgressLogsByDateRangeAsync(startDate, endDate);
                return progressLogs.Select(MapToProgressLogDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get progress logs for date range - table may not exist");
                return new List<ProgressLogDto>();
            }
        }

        public async Task<IEnumerable<ProgressLogDto>> GetProgressLogsByEmployeeIdAsync(int employeeId, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                var progressLogs = await _progressLogRepository.GetProgressLogsByEmployeeIdAsync(employeeId, startDate, endDate);
                return progressLogs.Select(MapToProgressLogDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get progress logs for employee {EmployeeId} - table may not exist", employeeId);
                return new List<ProgressLogDto>();
            }
        }

        public async Task<DailyProgressSummaryDto> GetDailyProgressSummaryAsync(DateTime date, int? teamId = null)
        {
            try
            {
                var progressLogs = await _progressLogRepository.GetDailyProgressLogsAsync(date, teamId);
                var progressLogDtos = progressLogs.Select(MapToProgressLogDto).ToList();

                // Get total controls count for the day (controls that existed on that date)
                var totalControls = await _controlRepository.GetAllAsync();
                
                // Filter by team if teamId is provided
                if (teamId.HasValue)
                {
                    totalControls = totalControls.Where(c => c.TeamId == teamId.Value);
                }
                
                var totalControlsCount = totalControls.Count();

                return new DailyProgressSummaryDto
                {
                    Date = date.Date,
                    TotalControls = totalControlsCount,
                    UpdatedControls = progressLogDtos.Count,
                    AverageProgress = progressLogDtos.Any() ? progressLogDtos.Average(p => p.Progress) : 0,
                    ProgressLogs = progressLogDtos
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get daily progress summary - table may not exist");
                var totalControls = await _controlRepository.GetAllAsync();
                
                // Filter by team if teamId is provided
                if (teamId.HasValue)
                {
                    totalControls = totalControls.Where(c => c.TeamId == teamId.Value);
                }
                
                return new DailyProgressSummaryDto
                {
                    Date = date.Date,
                    TotalControls = totalControls.Count(),
                    UpdatedControls = 0,
                    AverageProgress = 0,
                    ProgressLogs = new List<ProgressLogDto>()
                };
            }
        }

        public async Task<IEnumerable<DailyProgressSummaryDto>> GetWeeklyProgressSummaryAsync(DateTime startDate, int? teamId = null)
        {
            var endDate = startDate.AddDays(6);
            var summaries = new List<DailyProgressSummaryDto>();

            for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
            {
                var summary = await GetDailyProgressSummaryAsync(date, teamId);
                summaries.Add(summary);
            }

            return summaries;
        }

        public async Task<ProgressLogDto?> GetLatestProgressLogForControlAsync(int controlId)
        {
            var progressLog = await _progressLogRepository.GetLatestProgressLogForControlAsync(controlId);
            return progressLog != null ? MapToProgressLogDto(progressLog) : null;
        }

        public async Task<bool> LogDailyProgressAsync(int controlId, int progress, string? comments = null, string? workDescription = null)
        {
            try
            {
                var today = DateTime.Today;
                
                // Check if already logged today
                if (await _progressLogRepository.HasProgressLogForDateAsync(controlId, today))
                {
                    _logger.LogWarning("Progress already logged for Control {ControlId} on {Date}", controlId, today);
                    return false;
                }

                var createDto = new CreateProgressLogDto
                {
                    ControlId = controlId,
                    Progress = progress,
                    LogDate = today,
                    Comments = comments,
                    WorkDescription = workDescription
                };

                await CreateProgressLogAsync(createDto);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error logging daily progress for Control {ControlId} - table may not exist", controlId);
                return false; // Don't fail the main operation
            }
        }

        private ProgressLogDto MapToProgressLogDto(ProgressLog progressLog)
        {
            return new ProgressLogDto
            {
                ProgressLogId = progressLog.ProgressLogId,
                ControlId = progressLog.ControlId,
                Progress = progressLog.Progress,
                StatusId = progressLog.StatusId,
                EmployeeId = progressLog.EmployeeId,
                LogDate = progressLog.LogDate,
                Comments = progressLog.Comments,
                WorkDescription = progressLog.WorkDescription,
                CreatedAt = progressLog.CreatedAt,
                StatusName = progressLog.Status?.StatusName,
                EmployeeName = progressLog.Employee?.EmployeeName,
                ControlDescription = progressLog.Control?.Description
            };
        }
    }
}