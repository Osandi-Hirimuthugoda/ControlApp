using Microsoft.EntityFrameworkCore;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using ControlApp.API;
using System.Linq;

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
                
                // If status changed, use the progress value from frontend (which already calculated it)
                // The frontend handles the auto-update, so we trust the progress value it sends
                if (statusChanged)
                {
                    // Use the progress value provided by frontend (already calculated based on status)
                    control.Progress = updateControlDto.Progress;
                }
                else
                {
                    // Status didn't change, use provided progress (user manually set it)
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
            // Get all employees
            var allEmployees = await _context.Set<Employee>().ToListAsync();
            
            // Get employees that don't have controls yet
            var employeesWithoutControls = allEmployees
                .Where(e => !_context.Set<Controls>().Any(c => c.EmployeeId == e.Id))
                .ToList();

            if (!employeesWithoutControls.Any())
            {
                return new List<ControlDto>();
            }

            // Get default status and release for FK constraints
            var defaultStatus = await _context.Set<Status>().FirstOrDefaultAsync();
            var defaultRelease = await _context.Set<Release>().FirstOrDefaultAsync();

            var createdControls = new List<Controls>();

            foreach (var employee in employeesWithoutControls)
            {
                // Get control type if employee has one
                ControlType? controlType = null;
                if (employee.TypeId.HasValue)
                {
                    controlType = await _context.Set<ControlType>()
                        .FirstOrDefaultAsync(t => t.ControlTypeId == employee.TypeId.Value);
                }

                // Create control for employee
                var control = new Controls
                {
                    EmployeeId = employee.Id,
                    TypeId = employee.TypeId ?? 0, // Use employee's type or default to first available type
                    Description = !string.IsNullOrWhiteSpace(controlType?.Description)
                        ? controlType.Description
                        : (!string.IsNullOrWhiteSpace(employee.Description)
                            ? employee.Description
                            : $"Control for {employee.EmployeeName}"),
                    ReleaseDate = controlType?.ReleaseDate,
                    StatusId = defaultStatus?.Id,
                    ReleaseId = defaultRelease?.ReleaseId,
                    Progress = 0,
                    Comments = ""
                };

                // If TypeId is 0, find first available control type
                if (control.TypeId == 0)
                {
                    var firstType = await _context.Set<ControlType>().FirstOrDefaultAsync();
                    if (firstType != null)
                    {
                        control.TypeId = firstType.ControlTypeId;
                    }
                    else
                    {
                        // Skip if no control types exist
                        continue;
                    }
                }

                createdControls.Add(control);
            }

            if (createdControls.Any())
            {
                await _context.Set<Controls>().AddRangeAsync(createdControls);
                await _context.SaveChangesAsync();
            }

            // Return created controls with details
            var controlIds = createdControls.Select(c => c.ControlId).ToList();
            var controlsWithDetails = await _controlRepository.GetControlsWithDetailsAsync(null);
            return controlsWithDetails
                .Where(c => controlIds.Contains(c.ControlId))
                .Select(MapToDto);
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