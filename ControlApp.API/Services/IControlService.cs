using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IControlService
    {
        Task<IEnumerable<ControlDto>> GetAllControlsAsync(string? searchTerm = null);
        Task<ControlDto?> GetControlByIdAsync(int id);
        Task<ControlDto> CreateControlAsync(CreateControlDto createControlDto);
        Task<ControlDto?> UpdateControlAsync(int id, UpdateControlDto updateControlDto);
        Task<bool> DeleteControlAsync(int id);
        Task<IEnumerable<ControlDto>> AddAllEmployeesToControlsAsync();
    }
}







