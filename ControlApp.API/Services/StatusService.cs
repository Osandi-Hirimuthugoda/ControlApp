using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;

namespace ControlApp.API.Services
{
    public class StatusService : IStatusService
    {
        private readonly IStatusRepository _statusRepository;

        public StatusService(IStatusRepository statusRepository)
        {
            _statusRepository = statusRepository;
        }

        public async Task<IEnumerable<StatusDto>> GetAllStatusesAsync()
        {
            var statuses = await _statusRepository.GetAllAsync();
            return statuses.Select(MapToDto);
        }

        public async Task<StatusDto?> GetStatusByIdAsync(int id)
        {
            var status = await _statusRepository.GetByIdAsync(id);
            return status != null ? MapToDto(status) : null;
        }

        public async Task<StatusDto> CreateStatusAsync(CreateStatusDto createStatusDto)
        {
            var status = new Status
            {
                StatusName = createStatusDto.StatusName
            };

            var createdStatus = await _statusRepository.AddAsync(status);
            return MapToDto(createdStatus);
        }

        public async Task<StatusDto?> UpdateStatusAsync(int id, CreateStatusDto updateStatusDto)
        {
            var status = await _statusRepository.GetByIdAsync(id);
            if (status == null)
                return null;

            status.StatusName = updateStatusDto.StatusName;
            await _statusRepository.UpdateAsync(status);
            return MapToDto(status);
        }

        public async Task<bool> DeleteStatusAsync(int id)
        {
            return await _statusRepository.DeleteAsync(id);
        }

        private static StatusDto MapToDto(Status status)
        {
            return new StatusDto
            {
                Id = status.Id,
                StatusName = status.StatusName
            };
        }
    }
}












