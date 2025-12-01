using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;

namespace ControlApp.API.Services
{
    public class ControlTypeService : IControlTypeService
    {
        private readonly IControlTypeRepository _controlTypeRepository;

        public ControlTypeService(IControlTypeRepository controlTypeRepository)
        {
            _controlTypeRepository = controlTypeRepository;
        }

        public async Task<IEnumerable<ControlTypeDto>> GetAllControlTypesAsync()
        {
            var controlTypes = await _controlTypeRepository.GetAllAsync();
            return controlTypes.Select(MapToDto);
        }

        public async Task<ControlTypeDto?> GetControlTypeByIdAsync(int id)
        {
            var controlType = await _controlTypeRepository.GetByIdAsync(id);
            return controlType != null ? MapToDto(controlType) : null;
        }

        public async Task<ControlTypeDto> CreateControlTypeAsync(CreateControlTypeDto createControlTypeDto)
        {
            var controlType = new ControlType
            {
                TypeName = createControlTypeDto.TypeName
            };

            var createdControlType = await _controlTypeRepository.AddAsync(controlType);
            return MapToDto(createdControlType);
        }

        public async Task<ControlTypeDto?> UpdateControlTypeAsync(int id, CreateControlTypeDto updateControlTypeDto)
        {
            var controlType = await _controlTypeRepository.GetByIdAsync(id);
            if (controlType == null)
                return null;

            controlType.TypeName = updateControlTypeDto.TypeName;
            await _controlTypeRepository.UpdateAsync(controlType);
            return MapToDto(controlType);
        }

        public async Task<bool> DeleteControlTypeAsync(int id)
        {
            return await _controlTypeRepository.DeleteAsync(id);
        }

        private static ControlTypeDto MapToDto(ControlType controlType)
        {
            return new ControlTypeDto
            {
                ControlTypeId = controlType.ControlTypeId,
                TypeName = controlType.TypeName
            };
        }
    }
}












