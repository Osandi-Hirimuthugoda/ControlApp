using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public interface IDefectRepository : IRepository<Defect>
    {
        Task<IEnumerable<Defect>> GetByControlIdAsync(int controlId);
        Task<IEnumerable<Defect>> GetByTeamIdAsync(int teamId);
        Task<IEnumerable<Defect>> GetByStatusAsync(string status, int teamId);
        Task<IEnumerable<Defect>> GetBySeverityAsync(string severity, int teamId);
        Task<IEnumerable<Defect>> GetByAssignedToAsync(int employeeId);
        Task<IEnumerable<Defect>> GetByReportedByAsync(int employeeId);
    }
}
