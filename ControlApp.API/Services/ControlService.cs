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
using System.Text.Json;

namespace ControlApp.API.Services
{
    public class ControlService : IControlService //implementation 
    {
        private readonly IControlRepository _controlRepository;
        private readonly AppDbContext _context;
        private readonly ILogger<ControlService> _logger;
        private readonly IProgressLogService _progressLogService;

        public ControlService(IControlRepository controlRepository, AppDbContext context, ILogger<ControlService> logger, IProgressLogService progressLogService)
        {
            _controlRepository = controlRepository;
            _context = context;
            _logger = logger;
            _progressLogService = progressLogService;
        }
    
        public async Task<IEnumerable<ControlDto>> GetAllControlsAsync(string? searchTerm = null, int? teamId = null)
        {
            var controls = await _controlRepository.GetControlsWithDetailsAsync(searchTerm);
            
            // Filter by team if teamId is provided
            if (teamId.HasValue)
            {
                controls = controls.Where(c => c.TeamId == teamId.Value).ToList();
            }
            
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
                UpdatedAt = DateTime.UtcNow,
                TeamId = createControlDto.TeamId
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

            // Handle Per-Status Progress Preservation
            var statusProgressMap = new Dictionary<int, int>();
            if (!string.IsNullOrEmpty(control.StatusProgress))
            {
                try { statusProgressMap = JsonSerializer.Deserialize<Dictionary<int, int>>(control.StatusProgress) ?? new Dictionary<int, int>(); }
                catch { /* fallback to empty */ }
            }

            // Determine if Status is changing (manually or via auto-advance)
            int? oldStatusId = control.StatusId;
            int? newStatusId = updateControlDto.StatusId.HasValue && updateControlDto.StatusId.Value > 0 
                ? updateControlDto.StatusId.Value 
                : control.StatusId;

            // Update main fields
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
            if (updateControlDto.ReleaseId.HasValue && updateControlDto.ReleaseId.Value > 0)
            {
                var release = await _context.Set<Release>().FirstOrDefaultAsync(r => r.ReleaseId == updateControlDto.ReleaseId.Value);
                if (release != null)
                {
                    control.ReleaseId = updateControlDto.ReleaseId.Value;
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
                control.ReleaseDate = updateControlDto.ReleaseDate;
            }

            // If status is NOT changing, just update progress for current status
            if (oldStatusId == newStatusId)
            {
                control.Progress = updateControlDto.Progress;
                if (oldStatusId.HasValue)
                {
                    statusProgressMap[oldStatusId.Value] = control.Progress;
                }
                _logger.LogInformation("Status NOT changing. StatusId: {StatusId}, Progress: {Progress}", oldStatusId, control.Progress);
            }
            else
            {
                // Status IS changing manually
                _logger.LogInformation("Status IS changing. Old: {OldStatusId}, New: {NewStatusId}, Current Progress: {CurrentProgress}", 
                    oldStatusId, newStatusId, control.Progress);
                
                // 1. Save progress for the OLD status
                if (oldStatusId.HasValue)
                {
                    statusProgressMap[oldStatusId.Value] = control.Progress;
                    _logger.LogInformation("Saved progress {Progress}% for old status {StatusId}", control.Progress, oldStatusId.Value);
                }

                // 2. Set the NEW status
                control.StatusId = newStatusId;

                // 3. Load progress for the NEW status if it exists in map, else use DTO progress
                if (newStatusId.HasValue && statusProgressMap.ContainsKey(newStatusId.Value))
                {
                    control.Progress = statusProgressMap[newStatusId.Value];
                    _logger.LogInformation("Restored progress {Progress}% for new status {StatusId}", control.Progress, newStatusId.Value);
                }
                else
                {
                    control.Progress = updateControlDto.Progress;
                    if (newStatusId.HasValue)
                    {
                        statusProgressMap[newStatusId.Value] = control.Progress;
                    }
                    _logger.LogInformation("No saved progress for new status {StatusId}, using DTO progress: {Progress}%", newStatusId, control.Progress);
                }
            }
            
            // Handle Auto-Advancement logic (if progress reaches 100%)
            if (control.Progress >= 100)
            {
                Status? currentStatus = null;
                if (control.StatusId.HasValue)
                {
                    currentStatus = await _context.Set<Status>().FirstOrDefaultAsync(s => s.Id == control.StatusId.Value);
                }
                
                if (currentStatus != null)
                {
                    var nextStatus = await GetNextStatusAsync(currentStatus.StatusName);
                    if (nextStatus != null)
                    {
                        // Save the 100% for the status we just finished
                        statusProgressMap[currentStatus.Id] = 100;

                        // Advance to next status
                        control.StatusId = nextStatus.Id;
                        
                        // Load progress for next status if it exists, otherwise 0
                        if (statusProgressMap.ContainsKey(nextStatus.Id))
                        {
                            control.Progress = statusProgressMap[nextStatus.Id];
                        }
                        else
                        {
                            control.Progress = 0;
                            statusProgressMap[nextStatus.Id] = 0;
                        }

                        _logger.LogInformation("Auto-advancing status from '{CurrentStatus}' to '{NextStatus}' for ControlId: {ControlId}", 
                            currentStatus.StatusName, nextStatus.StatusName, control.ControlId);
                    }
                }
            }

            // Serialize the updated map back to JSON
            control.StatusProgress = JsonSerializer.Serialize(statusProgressMap);
            _logger.LogInformation("Updated StatusProgress JSON for ControlId {ControlId}: {StatusProgress}", control.ControlId, control.StatusProgress);

            control.UpdatedAt = DateTime.UtcNow;

            // Log daily progress if requested
            if (updateControlDto.LogDailyProgress)
            {
                try
                {
                    await _progressLogService.LogDailyProgressAsync(
                        control.ControlId,
                        control.Progress,
                        updateControlDto.DailyComments,
                        updateControlDto.WorkDescription
                    );
                    _logger.LogInformation("Daily progress logged for Control {ControlId} with {Progress}% progress", 
                        control.ControlId, control.Progress);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to log daily progress for Control {ControlId}", control.ControlId);
                    // Don't fail the update if progress logging fails
                }
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
                StatusProgress = control.StatusProgress,
                ReleaseDate = control.ReleaseDate,
                UpdatedAt = control.UpdatedAt,
                TeamId = control.TeamId,
                TeamName = control.Team?.TeamName
            };
        }
    }
}