using Microsoft.EntityFrameworkCore;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using ControlApp.API;

namespace ControlApp.API.Services
{
    public class ControlService : IControlService
    {
        private readonly IControlRepository _controlRepository;
        private readonly AppDbContext _context;

        public ControlService(IControlRepository controlRepository, AppDbContext context)
        {
            _controlRepository = controlRepository;
            _context = context;
        }
    
        public async Task<IEnumerable<ControlDto>> GetAllControlsAsync(string? searchTerm = null)
        {
            var controls = await _controlRepository.GetControlsWithDetailsAsync(searchTerm);
            return controls.Select(MapToDto);
        }

        public async Task<ControlDto?> GetControlByIdAsync(int id)
        {
            var control = await _controlRepository.GetControlWithDetailsByIdAsync(id);
            return control != null ? MapToDto(control) : null;
        }

        public async Task<ControlDto> CreateControlAsync(CreateControlDto createControlDto)
        {
            var typeExists = await _context.Set<ControlType>().AnyAsync(t => t.ControlTypeId == createControlDto.TypeId);
            var employeeExists = await _context.Set<Employee>().AnyAsync(e => e.Id == createControlDto.EmployeeId);

            if (!typeExists) throw new ArgumentException($"Invalid Type ID");
            if (!employeeExists) throw new ArgumentException($"Invalid Employee ID");

            var control = new Controls
            {
                Description = createControlDto.Description,
                Comments = createControlDto.Comments,
                TypeId = createControlDto.TypeId,
                EmployeeId = createControlDto.EmployeeId,
                
                StatusId = (createControlDto.StatusId.HasValue && createControlDto.StatusId > 0) ? createControlDto.StatusId : null,
                
                ReleaseId = null, 
                
                ReleaseDate = createControlDto.ReleaseDate,
                Progress = createControlDto.Progress
            };

            var createdControl = await _controlRepository.AddAsync(control);
            var controlWithDetails = await _controlRepository.GetControlWithDetailsByIdAsync(createdControl.ControlId);
            return controlWithDetails != null ? MapToDto(controlWithDetails) : MapToDto(createdControl);
        }

        public async Task<ControlDto?> UpdateControlAsync(int id, UpdateControlDto updateControlDto)
        {
            var control = await _controlRepository.GetByIdAsync(id);
            if (control == null) return null;

            if (updateControlDto.TypeId.HasValue)
            {
                 var typeExists = await _context.Set<ControlType>().AnyAsync(t => t.ControlTypeId == updateControlDto.TypeId);
                 if (!typeExists) throw new ArgumentException($"Invalid Type ID");
                 control.TypeId = updateControlDto.TypeId.Value;
            }

            if (updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0)
            {
                var statusExists = await _context.Set<Status>().AnyAsync(s => s.Id == updateControlDto.StatusId.Value);
                if (!statusExists) throw new ArgumentException($"Invalid Status ID");
            }

            control.Description = updateControlDto.Description;
            control.Comments = updateControlDto.Comments;
            control.EmployeeId = updateControlDto.EmployeeId;
            control.Progress = updateControlDto.Progress;
            
            
            if (updateControlDto.ReleaseId.HasValue && updateControlDto.ReleaseId.Value > 0)
            {
                var releaseExists = await _context.Set<Release>().AnyAsync(r => r.ReleaseId == updateControlDto.ReleaseId.Value);
                if (!releaseExists) throw new ArgumentException($"Invalid Release ID");
                control.ReleaseId = updateControlDto.ReleaseId.Value;
            }
            else
            {
                control.ReleaseId = null;
            }
            
            control.ReleaseDate = updateControlDto.ReleaseDate; 
     
            if (updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0)
            {
                control.StatusId = updateControlDto.StatusId.Value;
            }
            else
            {
                
                control.StatusId = null;
            }

            await _controlRepository.UpdateAsync(control);
            
            var controlWithDetails = await _controlRepository.GetControlWithDetailsByIdAsync(id);
            return controlWithDetails != null ? MapToDto(controlWithDetails) : MapToDto(control);
        }

        public async Task<bool> DeleteControlAsync(int id)
        {
            return await _controlRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ControlDto>> AddAllEmployeesToControlsAsync()
        {
             return new List<ControlDto>(); 
        }

        private static ControlDto MapToDto(Controls control)
        {
            return new ControlDto
            {
                ControlId = control.ControlId,
                Description = control.Description,
                Comments = control.Comments,
                TypeId = control.TypeId,
                TypeName = control.Type?.TypeName,
                EmployeeId = control.EmployeeId,
                EmployeeName = control.Employee?.EmployeeName,
                StatusId = control.StatusId,
                StatusName = control.Status?.StatusName,
                ReleaseId = control.ReleaseId,
                ReleaseName = control.Release?.ReleaseName, 
                Progress = control.Progress,
                ReleaseDate = control.ReleaseDate
            };
        }
    }
}