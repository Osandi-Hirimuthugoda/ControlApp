using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IProgressLogService
    {
        Task<ProgressLogDto> CreateProgressLogAsync(CreateProgressLogDto createProgressLogDto);
        Task<IEnumerable<ProgressLogDto>> GetProgressLogsByControlIdAsync(int controlId);
        Task<IEnumerable<ProgressLogDto>> GetProgressLogsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ProgressLogDto>> GetProgressLogsByEmployeeIdAsync(int employeeId, DateTime? startDate = null, DateTime? endDate = null);
        Task<DailyProgressSummaryDto> GetDailyProgressSummaryAsync(DateTime date, int? teamId = null);
        Task<IEnumerable<DailyProgressSummaryDto>> GetWeeklyProgressSummaryAsync(DateTime startDate, int? teamId = null);
        Task<ProgressLogDto?> GetLatestProgressLogForControlAsync(int controlId);
        Task<bool> LogDailyProgressAsync(int controlId, int progress, string? comments = null, string? workDescription = null);
    }
}