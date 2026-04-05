using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IControlService
    {
        Task<IEnumerable<ControlDto>> GetAllControlsAsync(string? searchTerm = null, int? teamId = null);
        Task<ControlDto?> GetControlByIdAsync(int id);
        Task<ControlDto> CreateControlAsync(CreateControlDto createControlDto, int? performerEmployeeId = null);
        Task<ControlDto?> UpdateControlAsync(int id, UpdateControlDto updateControlDto, int? performerEmployeeId = null);
        Task<bool> DeleteControlAsync(int id);
        Task<IEnumerable<ControlDto>> AddAllEmployeesToControlsAsync();
        Task<IEnumerable<ActivityLogDto>> GetActivityLogsAsync(int controlId);

        
    }
}







