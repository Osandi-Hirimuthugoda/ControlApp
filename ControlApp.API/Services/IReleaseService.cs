using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IReleaseService
    {
        Task<IEnumerable<ReleaseDto>> GetAllReleasesAsync(int? teamId = null);
        Task<ReleaseDto?> GetReleaseByIdAsync(int id);
        Task<ReleaseDto> CreateReleaseAsync(CreateReleaseDto createReleaseDto);
        Task<ReleaseDto?> UpdateReleaseAsync(int id, CreateReleaseDto updateReleaseDto);
        Task<bool> DeleteReleaseAsync(int id);
    }
}












