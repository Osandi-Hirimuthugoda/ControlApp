using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using ControlApp.API;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace ControlApp.API.Services
{
    public class ControlService : IControlService
    {
        private readonly IControlRepository _controlRepository;
        private readonly AppDbContext _context;
        private readonly ILogger<ControlService> _logger;

        public ControlService(IControlRepository controlRepository, AppDbContext context, ILogger<ControlService> logger)
        {
            _controlRepository = controlRepository;
            _context = context;
            _logger = logger;
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
            _logger.LogInformation("CreateControlAsync called with TypeId: {TypeId}, EmployeeId: {EmployeeId}", 
                createControlDto.TypeId, createControlDto.EmployeeId);

            // Validate TypeId exists
            var typeExists = await _context.Set<ControlType>().AnyAsync(t => t.ControlTypeId == createControlDto.TypeId);
            if (!typeExists)
            {
                _logger.LogWarning("Invalid TypeId: {TypeId}", createControlDto.TypeId);
                throw new ArgumentException($"Invalid Type ID: {createControlDto.TypeId}");
            }

            // Validate EmployeeId exists (if provided)
            if (createControlDto.EmployeeId.HasValue && createControlDto.EmployeeId.Value > 0)
            {
                var employeeExists = await _context.Set<Employee>().AnyAsync(e => e.Id == createControlDto.EmployeeId.Value);
                if (!employeeExists)
                {
                    _logger.LogWarning("Invalid EmployeeId: {EmployeeId}", createControlDto.EmployeeId.Value);
                    throw new ArgumentException($"Invalid Employee ID: {createControlDto.EmployeeId.Value}");
                }
                _logger.LogInformation("EmployeeId validation passed");
            }
            else
            {
                _logger.LogInformation("No EmployeeId provided - control will be created without employee assignment");
            }

            _logger.LogInformation("TypeId validation passed");

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
                    _logger.LogInformation("Using release date from Release table: {ReleaseDate}", releaseDate);
                }
            }
            
            // If still no release date, use the release date from the control type
            if (!releaseDate.HasValue && controlType?.ReleaseDate.HasValue == true)
            {
                releaseDate = controlType.ReleaseDate;
                _logger.LogInformation("Using release date from ControlType: {ReleaseDate}", releaseDate);
            }

            var control = new Controls
            {
                Description = createControlDto.Description,
                SubDescriptions = createControlDto.SubDescriptions,
                Comments = createControlDto.Comments,
                TypeId = createControlDto.TypeId,
                EmployeeId = createControlDto.EmployeeId.HasValue && createControlDto.EmployeeId.Value > 0 ? createControlDto.EmployeeId.Value : (int?)null,
                
                StatusId = (createControlDto.StatusId.HasValue && createControlDto.StatusId > 0) ? createControlDto.StatusId : null,
                
                ReleaseId = (createControlDto.ReleaseId.HasValue && createControlDto.ReleaseId.Value > 0) ? createControlDto.ReleaseId : null, 
                
                ReleaseDate = releaseDate,
                Progress = createControlDto.Progress,
                UpdatedAt = DateTime.UtcNow
            };

            _logger.LogInformation("Creating control entity: TypeId={TypeId}, EmployeeId={EmployeeId}, StatusId={StatusId}, ReleaseId={ReleaseId}, Progress={Progress}", 
                control.TypeId, control.EmployeeId, control.StatusId, control.ReleaseId, control.Progress);

            try
            {
                _logger.LogInformation("Attempting to save control to database: TypeId={TypeId}, EmployeeId={EmployeeId}, Description={Description}", 
                    control.TypeId, control.EmployeeId, control.Description);
                
                var createdControl = await _controlRepository.AddAsync(control);
                
                _logger.LogInformation("Control saved to database successfully. ControlId: {ControlId}, EmployeeId: {EmployeeId}", 
                    createdControl.ControlId, createdControl.EmployeeId);
                
                // Verify the control was saved by retrieving it
                var controlWithDetails = await _controlRepository.GetControlWithDetailsByIdAsync(createdControl.ControlId);
                if (controlWithDetails == null)
                {
                    _logger.LogError("CRITICAL: Control created but could not retrieve details for ID: {ControlId}. Data may not be persisted!", createdControl.ControlId);
                }
                else
                {
                    _logger.LogInformation("Control verified in database: ControlId={ControlId}, EmployeeId={EmployeeId}", 
                        controlWithDetails.ControlId, controlWithDetails.EmployeeId);
                }
                
                return controlWithDetails != null ? MapToDto(controlWithDetails) : MapToDto(createdControl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving control to database: {Message}. StackTrace: {StackTrace}", ex.Message, ex.StackTrace);
                throw new Exception($"Failed to save control to database: {ex.Message}", ex);
            }
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
            control.SubDescriptions = updateControlDto.SubDescriptions;
            control.Comments = updateControlDto.Comments;
            
            // Handle EmployeeId - allow null (controls without assigned employees)
            if (updateControlDto.EmployeeId.HasValue && updateControlDto.EmployeeId.Value > 0)
            {
                // Validate employee exists if provided
                var employeeExists = await _context.Set<Employee>().AnyAsync(e => e.Id == updateControlDto.EmployeeId.Value);
                if (!employeeExists)
                {
                    throw new ArgumentException($"Invalid Employee ID: {updateControlDto.EmployeeId.Value}");
                }
                control.EmployeeId = updateControlDto.EmployeeId.Value;
            }
            else
            {
                // Set to null if not provided or 0
                control.EmployeeId = null;
            }
            
            // Handle QAEmployeeId - allow null (controls without assigned QA Engineer)
            if (updateControlDto.QAEmployeeId.HasValue && updateControlDto.QAEmployeeId.Value > 0)
            {
                // Validate QA employee exists if provided
                var qaEmployeeExists = await _context.Set<Employee>().AnyAsync(e => e.Id == updateControlDto.QAEmployeeId.Value);
                if (!qaEmployeeExists)
                {
                    throw new ArgumentException($"Invalid QA Employee ID: {updateControlDto.QAEmployeeId.Value}");
                }
                control.QAEmployeeId = updateControlDto.QAEmployeeId.Value;
            }
            else
            {
                // Set to null if not provided or 0
                control.QAEmployeeId = null;
            }
            
            
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
     
            // Update progress first
            control.Progress = updateControlDto.Progress;
            
            // Check if progress reached 100% and automatically advance to next status
            if (updateControlDto.Progress >= 100)
            {
                // Get current status (use the one from control object, not DTO, to check current state)
                Status? currentStatus = null;
                if (control.StatusId.HasValue)
                {
                    currentStatus = await _context.Set<Status>().FirstOrDefaultAsync(s => s.Id == control.StatusId.Value);
                }
                
                // If we have a current status, try to advance to the next one
                if (currentStatus != null)
                {
                    var nextStatus = await GetNextStatusAsync(currentStatus.StatusName);
                    if (nextStatus != null)
                    {
                        control.StatusId = nextStatus.Id;
                        
                        // Update progress to match the default progress for the new status
                        var newProgress = GetProgressByStatus(nextStatus.StatusName);
                        if (newProgress.HasValue)
                        {
                            control.Progress = newProgress.Value;
                            _logger.LogInformation("Progress reached 100%. Auto-advancing status from '{CurrentStatus}' to '{NextStatus}' and setting progress to {Progress}% for ControlId: {ControlId}", 
                                currentStatus.StatusName, nextStatus.StatusName, newProgress.Value, control.ControlId);
                        }
                        else
                        {
                            _logger.LogInformation("Progress reached 100%. Auto-advancing status from '{CurrentStatus}' to '{NextStatus}' for ControlId: {ControlId}", 
                                currentStatus.StatusName, nextStatus.StatusName, control.ControlId);
                        }
                    }
                    else
                    {
                        // Already at the final status (QA), keep it at 100%
                        _logger.LogInformation("Progress reached 100% but already at final status '{StatusName}' for ControlId: {ControlId}", 
                            currentStatus.StatusName, control.ControlId);
                    }
                }
                else
                {
                    // No current status, use the one from DTO if provided
                    if (updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0)
                    {
                        control.StatusId = updateControlDto.StatusId.Value;
                    }
                }
            }
            else
            {
                // Progress is not 100%, use the status from DTO if provided
                if (updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0)
                {
                    control.StatusId = updateControlDto.StatusId.Value;
                }
                // If StatusId is not provided in DTO (null or 0), keep the existing status unchanged
            }

            control.UpdatedAt = DateTime.UtcNow;

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

        /// <summary>
        /// Gets the next status in the sequence when progress reaches 100%
        /// Status order: Analyze -> Development -> Dev Testing -> QA
        /// </summary>
        private async Task<Status?> GetNextStatusAsync(string currentStatusName)
        {
            var statusOrder = new[] { "Analyze", "Development", "Dev Testing", "QA" };
            var currentIndex = Array.IndexOf(statusOrder, currentStatusName);
            
            // If current status is not in the order or is the last one, return null
            if (currentIndex < 0 || currentIndex >= statusOrder.Length - 1)
            {
                return null;
            }
            
            // Get the next status name
            var nextStatusName = statusOrder[currentIndex + 1];
            
            // Find and return the next status from database
            var nextStatus = await _context.Set<Status>()
                .FirstOrDefaultAsync(s => s.StatusName == nextStatusName);
            
            return nextStatus;
        }

        private static ControlDto MapToDto(Controls control)
        {
            return new ControlDto
            {
                ControlId = control.ControlId,
                Description = control.Description,
                SubDescriptions = control.SubDescriptions,
                Comments = control.Comments,
                TypeId = control.TypeId,
                TypeName = control.Type?.TypeName,
                EmployeeId = control.EmployeeId,
                EmployeeName = control.Employee?.EmployeeName,
                QAEmployeeId = control.QAEmployeeId,
                QAEmployeeName = control.QAEmployee?.EmployeeName,
                StatusId = control.StatusId,
                StatusName = control.Status?.StatusName,
                ReleaseId = control.ReleaseId,
                ReleaseName = control.Release?.ReleaseName, 
                Progress = control.Progress,
                ReleaseDate = control.ReleaseDate,
                UpdatedAt = control.UpdatedAt
            };
        }
    }
}