using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;

namespace ControlApp.API.Services
{
    public class ReleaseService : IReleaseService
    {
        private readonly IReleaseRepository _releaseRepository;

        public ReleaseService(IReleaseRepository releaseRepository)
        {
            _releaseRepository = releaseRepository;
        }

        public async Task<IEnumerable<ReleaseDto>> GetAllReleasesAsync()
        {
            var releases = await _releaseRepository.GetAllAsync();
            return releases.Select(MapToDto);
        }

        public async Task<ReleaseDto?> GetReleaseByIdAsync(int id)
        {
            var release = await _releaseRepository.GetByIdAsync(id);
            return release != null ? MapToDto(release) : null;
        }

        public async Task<ReleaseDto> CreateReleaseAsync(CreateReleaseDto createReleaseDto)
        {
            var release = new Release
            {
                ReleaseName = createReleaseDto.ReleaseName,
                ReleaseDate = createReleaseDto.ReleaseDate,
                Description = createReleaseDto.Description
            };

            var createdRelease = await _releaseRepository.AddAsync(release);
            return MapToDto(createdRelease);
        }

        public async Task<ReleaseDto?> UpdateReleaseAsync(int id, CreateReleaseDto updateReleaseDto)
        {
            var release = await _releaseRepository.GetByIdAsync(id);
            if (release == null)
                return null;

            release.ReleaseName = updateReleaseDto.ReleaseName;
            release.ReleaseDate = updateReleaseDto.ReleaseDate;
            release.Description = updateReleaseDto.Description;
            await _releaseRepository.UpdateAsync(release);
            return MapToDto(release);
        }

        public async Task<bool> DeleteReleaseAsync(int id)
        {
            return await _releaseRepository.DeleteAsync(id);
        }

        private static ReleaseDto MapToDto(Release release)
        {
            return new ReleaseDto
            {
                ReleaseId = release.ReleaseId,
                ReleaseName = release.ReleaseName,
                ReleaseDate = release.ReleaseDate,
                Description = release.Description
            };
        }
    }
}












