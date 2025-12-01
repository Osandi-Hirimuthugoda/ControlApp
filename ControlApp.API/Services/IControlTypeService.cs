using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IControlTypeService
    {
        Task<IEnumerable<ControlTypeDto>> GetAllControlTypesAsync();
        Task<ControlTypeDto?> GetControlTypeByIdAsync(int id);
        Task<ControlTypeDto> CreateControlTypeAsync(CreateControlTypeDto createControlTypeDto);
        Task<ControlTypeDto?> UpdateControlTypeAsync(int id, CreateControlTypeDto updateControlTypeDto);
        Task<bool> DeleteControlTypeAsync(int id);
    }
}












