using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public interface IProgressLogRepository : IRepository<ProgressLog>
    {
        Task<IEnumerable<ProgressLog>> GetProgressLogsByControlIdAsync(int controlId);
        Task<IEnumerable<ProgressLog>> GetProgressLogsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ProgressLog>> GetProgressLogsByEmployeeIdAsync(int employeeId, DateTime? startDate = null, DateTime? endDate = null);
        Task<ProgressLog?> GetLatestProgressLogForControlAsync(int controlId);
        Task<IEnumerable<ProgressLog>> GetDailyProgressLogsAsync(DateTime date, int? teamId = null);
        Task<bool> HasProgressLogForDateAsync(int controlId, DateTime date);
    }
}