using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IDefectService
    {
        Task<IEnumerable<DefectDto>> GetAllAsync(int teamId);
        Task<DefectDto?> GetByIdAsync(int id);
        Task<IEnumerable<DefectDto>> GetByControlIdAsync(int controlId);
        Task<IEnumerable<DefectDto>> GetByTeamIdAsync(int teamId);
        Task<IEnumerable<DefectDto>> GetByStatusAsync(string status, int teamId);
        Task<IEnumerable<DefectDto>> GetBySeverityAsync(string severity, int teamId);
        Task<IEnumerable<DefectDto>> GetByAssignedToAsync(int employeeId);
        Task<IEnumerable<DefectDto>> GetByReportedByAsync(int employeeId);
        Task<DefectDto> CreateAsync(CreateDefectDto createDto, int reportedByEmployeeId, int teamId);
        Task<DefectDto?> UpdateAsync(int id, UpdateDefectDto updateDto, int? updatedByEmployeeId = null);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ActivityLogDto>> GetActivityLogsAsync(int controlId);
    }
}
