using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IStatusService
    {
        Task<IEnumerable<StatusDto>> GetAllStatusesAsync();
        Task<StatusDto?> GetStatusByIdAsync(int id);
        Task<StatusDto> CreateStatusAsync(CreateStatusDto createStatusDto);
        Task<StatusDto?> UpdateStatusAsync(int id, CreateStatusDto updateStatusDto);
        Task<bool> DeleteStatusAsync(int id);
    }
}












