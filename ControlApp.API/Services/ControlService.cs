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

            // TypeId is required - if not provided in DTO, keep existing value, otherwise validate and update
            if (updateControlDto.TypeId.HasValue)
            {
                 var typeExists = await _context.Set<ControlType>().AnyAsync(t => t.ControlTypeId == updateControlDto.TypeId.Value);
                 if (!typeExists) throw new ArgumentException($"Invalid Type ID: {updateControlDto.TypeId.Value}");
                 control.TypeId = updateControlDto.TypeId.Value;
            }
            // If TypeId is not provided, keep the existing TypeId (don't change it)

            if (updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0)
            {
                var statusExists = await _context.Set<Status>().AnyAsync(s => s.Id == updateControlDto.StatusId.Value);
                if (!statusExists) throw new ArgumentException($"Invalid Status ID");
            }

            control.Description = updateControlDto.Description;
            control.Comments = updateControlDto.Comments;
            control.EmployeeId = updateControlDto.EmployeeId;
            
            
            // Handle ReleaseId - only set if it exists in database
            if (updateControlDto.ReleaseId.HasValue && updateControlDto.ReleaseId.Value > 0)
            {
                var releaseExists = await _context.Set<Release>().AnyAsync(r => r.ReleaseId == updateControlDto.ReleaseId.Value);
                if (releaseExists)
                {
                    control.ReleaseId = updateControlDto.ReleaseId.Value;
                }
                else
                {
                    
                    control.ReleaseId = null;
                }
            }
            else
            {
                control.ReleaseId = null;
            }
            
            // Set ReleaseDate (can be set even if ReleaseId is null for default releases)
            control.ReleaseDate = updateControlDto.ReleaseDate; 
     
            // Handle StatusId and auto-update Progress based on Status
            // Always save the progress value provided by the user (frontend handles auto-update when status changes)
            if (updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0)
            {
                // Check if status is changing BEFORE updating it
                var statusChanged = control.StatusId != updateControlDto.StatusId.Value;
                control.StatusId = updateControlDto.StatusId.Value;
                
                // If status changed, check if we should auto-update progress
                if (statusChanged)
                {
                    var status = await _context.Set<Status>().FirstOrDefaultAsync(s => s.Id == updateControlDto.StatusId.Value);
                    if (status != null)
                    {
                        var autoProgressValue = GetProgressByStatus(status.StatusName);
                        // Only auto-update if progress is 0 (meaning it wasn't manually set)
                        // Otherwise, use the provided progress value (user manually set it)
                        if (autoProgressValue.HasValue && updateControlDto.Progress == 0)
                        {
                            control.Progress = autoProgressValue.Value;
                        }
                        else
                        {
                            // User manually set progress, save that value
                            control.Progress = updateControlDto.Progress;
                        }
                    }
                    else
                    {
                        control.Progress = updateControlDto.Progress;
                    }
                }
                else
                {
                    // Status didn't change, always use provided progress (user manually set it)
                    control.Progress = updateControlDto.Progress;
                }
            }
            else
            {
                control.StatusId = null;
                // Always save the provided progress value
                control.Progress = updateControlDto.Progress;
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

        private static int? GetProgressByStatus(string statusName)
        {
            return statusName switch
            {
                "Analyze" => 25,
                "Development" => 50,
                "Dev Testing" => 75,
                "QA" => 100,
                _ => null
            };
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