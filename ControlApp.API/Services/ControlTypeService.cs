using Microsoft.EntityFrameworkCore;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using ControlApp.API;

namespace ControlApp.API.Services
{
    public class ControlTypeService : IControlTypeService
    {
        private readonly IControlTypeRepository _controlTypeRepository;
        private readonly AppDbContext _context;

        public ControlTypeService(IControlTypeRepository controlTypeRepository, AppDbContext context)
        {
            _controlTypeRepository = controlTypeRepository;
            _context = context;
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
                TypeName = createControlTypeDto.TypeName,
                Description = createControlTypeDto.Description,
                ReleaseDate = createControlTypeDto.ReleaseDate
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
            controlType.Description = updateControlTypeDto.Description;
            controlType.ReleaseDate = updateControlTypeDto.ReleaseDate;
            await _controlTypeRepository.UpdateAsync(controlType);
            return MapToDto(controlType);
        }

        public async Task<bool> DeleteControlTypeAsync(int id)
        {
            var controlType = await _controlTypeRepository.GetByIdAsync(id);
            if (controlType == null)
                return false;

            // Check if any controls or employees are using this type
            var controlsUsingType = await _context.Set<Controls>().Where(c => c.TypeId == id).ToListAsync();
            var employeesUsingType = await _context.Set<Employee>().Where(e => e.TypeId == id).ToListAsync();

            if (controlsUsingType.Any() || employeesUsingType.Any())
            {
                // Get a default type to reassign (first available type that's not the one being deleted)
                var defaultType = await _context.Set<ControlType>()
                    .FirstOrDefaultAsync(t => t.ControlTypeId != id);
                
                if (defaultType == null)
                {
                    throw new InvalidOperationException("Cannot delete the last control type. At least one type must exist.");
                }

                // Reassign controls to default type
                foreach (var control in controlsUsingType)
                {
                    control.TypeId = defaultType.ControlTypeId;
                }

                // Reassign employees to default type
                foreach (var employee in employeesUsingType)
                {
                    employee.TypeId = defaultType.ControlTypeId;
                }

                await _context.SaveChangesAsync();
            }

            return await _controlTypeRepository.DeleteAsync(id);
        }

        private static ControlTypeDto MapToDto(ControlType controlType)
        {
            return new ControlTypeDto
            {
                ControlTypeId = controlType.ControlTypeId,
                TypeName = controlType.TypeName,
                Description = controlType.Description,
                ReleaseDate = controlType.ReleaseDate
            };
        }
    }
}












