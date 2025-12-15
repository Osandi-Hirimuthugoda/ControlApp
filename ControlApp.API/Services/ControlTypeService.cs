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
            // Validate required fields
            if (string.IsNullOrWhiteSpace(createControlTypeDto.TypeName))
            {
                throw new ArgumentException("Type Name is required.");
            }

            if (string.IsNullOrWhiteSpace(createControlTypeDto.Description))
            {
                throw new ArgumentException("Description is required.");
            }

            // Check for duplicate type name AND description combination (case-insensitive)
            // Load all control types and check in memory to ensure case-insensitive comparison works correctly
            var trimmedTypeName = createControlTypeDto.TypeName.Trim();
            var trimmedDescription = createControlTypeDto.Description.Trim();
            
            var allTypes = await _context.Set<ControlType>().ToListAsync();
            var existingType = allTypes.FirstOrDefault(t => 
                t.TypeName != null && 
                t.TypeName.Trim().Equals(trimmedTypeName, StringComparison.OrdinalIgnoreCase) && 
                t.Description != null && 
                t.Description.Trim().Equals(trimmedDescription, StringComparison.OrdinalIgnoreCase));
            
            if (existingType != null)
            {
                throw new ArgumentException($"A control type with the name '{createControlTypeDto.TypeName}' and description '{createControlTypeDto.Description}' already exists. Please use a different description.");
            }

            var controlType = new ControlType
            {
                TypeName = createControlTypeDto.TypeName.Trim(),
                Description = createControlTypeDto.Description.Trim(),
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

            // Validate required fields
            if (string.IsNullOrWhiteSpace(updateControlTypeDto.TypeName))
            {
                throw new ArgumentException("Type Name is required.");
            }

            if (string.IsNullOrWhiteSpace(updateControlTypeDto.Description))
            {
                throw new ArgumentException("Description is required.");
            }

            // Check for duplicate type name AND description combination (excluding current type)
            // Load all control types and check in memory to ensure case-insensitive comparison works correctly
            var trimmedTypeName = updateControlTypeDto.TypeName.Trim();
            var trimmedDescription = updateControlTypeDto.Description.Trim();
            
            var allTypes = await _context.Set<ControlType>().ToListAsync();
            var existingType = allTypes.FirstOrDefault(t => 
                t.ControlTypeId != id &&
                t.TypeName != null && 
                t.TypeName.Trim().Equals(trimmedTypeName, StringComparison.OrdinalIgnoreCase) && 
                t.Description != null && 
                t.Description.Trim().Equals(trimmedDescription, StringComparison.OrdinalIgnoreCase));
            
            if (existingType != null)
            {
                throw new ArgumentException($"A control type with the name '{updateControlTypeDto.TypeName}' and description '{updateControlTypeDto.Description}' already exists. Please use a different description.");
            }

            controlType.TypeName = updateControlTypeDto.TypeName.Trim();
            controlType.Description = updateControlTypeDto.Description.Trim();
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












