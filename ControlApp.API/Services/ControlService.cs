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

            // Get the control type to retrieve its release date
            var controlType = await _context.Set<ControlType>().FirstOrDefaultAsync(t => t.ControlTypeId == createControlDto.TypeId);
            
            // Determine ReleaseDate: Priority 1) DTO ReleaseDate, 2) Release table if ReleaseId provided, 3) ControlType ReleaseDate
            DateTime? releaseDate = createControlDto.ReleaseDate;
            
            // If ReleaseDate is not provided but ReleaseId is provided, get it from Release table
            if (!releaseDate.HasValue && createControlDto.ReleaseId.HasValue && createControlDto.ReleaseId.Value > 0)
            {
                var release = await _context.Set<Release>().FirstOrDefaultAsync(r => r.ReleaseId == createControlDto.ReleaseId.Value);
                if (release != null)
                {
                    releaseDate = release.ReleaseDate;
                }
            }
            
            // If still no release date, use the release date from the control type
            if (!releaseDate.HasValue && controlType?.ReleaseDate.HasValue == true)
            {
                releaseDate = controlType.ReleaseDate;
            }

            var control = new Controls
            {
                Description = createControlDto.Description,
                Comments = createControlDto.Comments,
                TypeId = createControlDto.TypeId,
                EmployeeId = createControlDto.EmployeeId,
                
                StatusId = (createControlDto.StatusId.HasValue && createControlDto.StatusId > 0) ? createControlDto.StatusId : null,
                
                ReleaseId = (createControlDto.ReleaseId.HasValue && createControlDto.ReleaseId.Value > 0) ? createControlDto.ReleaseId : null, 
                
                ReleaseDate = releaseDate,
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
            // If ReleaseId is provided, get the ReleaseDate from the Release table
            if (updateControlDto.ReleaseId.HasValue && updateControlDto.ReleaseId.Value > 0)
            {
                var release = await _context.Set<Release>().FirstOrDefaultAsync(r => r.ReleaseId == updateControlDto.ReleaseId.Value);
                if (release != null)
                {
                    control.ReleaseId = updateControlDto.ReleaseId.Value;
                    // If ReleaseDate is not explicitly provided in DTO, get it from Release table
                    if (!updateControlDto.ReleaseDate.HasValue)
                    {
                        control.ReleaseDate = release.ReleaseDate;
                    }
                    else
                    {
                        control.ReleaseDate = updateControlDto.ReleaseDate;
                    }
                }
                else
                {
                    control.ReleaseId = null;
                    control.ReleaseDate = updateControlDto.ReleaseDate;
                }
            }
            else
            {
                control.ReleaseId = null;
                // If ReleaseId is removed but ReleaseDate is provided, use it
                control.ReleaseDate = updateControlDto.ReleaseDate;
            } 
     
            if (updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0)
            {
                
                var statusChanged = control.StatusId != updateControlDto.StatusId.Value;
                control.StatusId = updateControlDto.StatusId.Value;
                
                if (statusChanged)
                {
                    
                    control.Progress = updateControlDto.Progress;
                }
                else
                {
                    
                    control.Progress = updateControlDto.Progress;
                }
            }
            else
            {
                control.StatusId = null;
                
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
            
            var allEmployees = await _context.Set<Employee>().ToListAsync();
            
            
            var employeesWithoutControls = allEmployees
                .Where(e => !_context.Set<Controls>().Any(c => c.EmployeeId == e.Id))
                .ToList();

            if (!employeesWithoutControls.Any())
            {
                return new List<ControlDto>();
            }

           
            var defaultStatus = await _context.Set<Status>().FirstOrDefaultAsync();
            var defaultRelease = await _context.Set<Release>().FirstOrDefaultAsync();

            var createdControls = new List<Controls>();

            foreach (var employee in employeesWithoutControls)
            {

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
                    TypeId = employee.TypeId ?? 0, 
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