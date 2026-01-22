using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Services
{
    public class DefectService : IDefectService
    {
        private readonly IDefectRepository _defectRepository;
        private readonly AppDbContext _context;

        public DefectService(IDefectRepository defectRepository, AppDbContext context)
        {
            _defectRepository = defectRepository;
            _context = context;
        }

        public async Task<IEnumerable<DefectDto>> GetAllAsync(int teamId)
        {
            var defects = await _defectRepository.GetByTeamIdAsync(teamId);
            return defects.Select(MapToDto);
        }

        public async Task<DefectDto?> GetByIdAsync(int id)
        {
            var defect = await _defectRepository.GetByIdAsync(id);
            return defect != null ? MapToDto(defect) : null;
        }

        public async Task<IEnumerable<DefectDto>> GetByControlIdAsync(int controlId)
        {
            var defects = await _defectRepository.GetByControlIdAsync(controlId);
            return defects.Select(MapToDto);
        }

        public async Task<IEnumerable<DefectDto>> GetByTeamIdAsync(int teamId)
        {
            var defects = await _defectRepository.GetByTeamIdAsync(teamId);
            return defects.Select(MapToDto);
        }

        public async Task<IEnumerable<DefectDto>> GetByStatusAsync(string status, int teamId)
        {
            var defects = await _defectRepository.GetByStatusAsync(status, teamId);
            return defects.Select(MapToDto);
        }

        public async Task<IEnumerable<DefectDto>> GetBySeverityAsync(string severity, int teamId)
        {
            var defects = await _defectRepository.GetBySeverityAsync(severity, teamId);
            return defects.Select(MapToDto);
        }

        public async Task<IEnumerable<DefectDto>> GetByAssignedToAsync(int employeeId)
        {
            var defects = await _defectRepository.GetByAssignedToAsync(employeeId);
            return defects.Select(MapToDto);
        }

        public async Task<IEnumerable<DefectDto>> GetByReportedByAsync(int employeeId)
        {
            var defects = await _defectRepository.GetByReportedByAsync(employeeId);
            return defects.Select(MapToDto);
        }

        public async Task<DefectDto> CreateAsync(CreateDefectDto createDto, int reportedByEmployeeId, int teamId)
        {
            var control = await _context.Set<Controls>().FirstOrDefaultAsync(c => c.ControlId == createDto.ControlId);
            if (control == null) throw new ArgumentException($"Control with ID {createDto.ControlId} not found");

            var team = await _context.Set<Team>().FirstOrDefaultAsync(t => t.TeamId == teamId);
            if (team == null) throw new ArgumentException($"Team with ID {teamId} not found");

            var reporter = await _context.Set<Employee>().FirstOrDefaultAsync(e => e.Id == reportedByEmployeeId);
            if (reporter == null) throw new ArgumentException($"Reporter employee with ID {reportedByEmployeeId} not found");

            var defect = new Defect
            {
                ControlId = createDto.ControlId,
                SubDescriptionIndex = createDto.SubDescriptionIndex,
                Title = createDto.Title,
                Description = createDto.Description,
                Severity = createDto.Severity,
                Priority = createDto.Priority,
                Status = "Open",
                ReportedByEmployeeId = reportedByEmployeeId,
                AssignedToEmployeeId = createDto.AssignedToEmployeeId,
                AttachmentUrl = createDto.AttachmentUrl,
                Category = createDto.Category,
                ReportedDate = DateTime.UtcNow,
                TeamId = teamId
            };

            var created = await _defectRepository.AddAsync(defect);

            // Log activity
            await LogActivityAsync("Defect", created.DefectId, createDto.ControlId, "Created",
                null, "Open", $"Defect '{createDto.Title}' reported", reportedByEmployeeId, reporter.EmployeeName, teamId);

            var reloaded = await _defectRepository.GetByIdAsync(created.DefectId);
            return MapToDto(reloaded!);
        }

        public async Task<DefectDto?> UpdateAsync(int id, UpdateDefectDto updateDto, int? updatedByEmployeeId = null)
        {
            var defect = await _defectRepository.GetByIdAsync(id);
            if (defect == null) return null;

            var oldStatus = defect.Status;

            if (!string.IsNullOrEmpty(updateDto.Title)) defect.Title = updateDto.Title;
            if (updateDto.Description != null) defect.Description = updateDto.Description;
            if (!string.IsNullOrEmpty(updateDto.Severity)) defect.Severity = updateDto.Severity;
            if (!string.IsNullOrEmpty(updateDto.Priority)) defect.Priority = updateDto.Priority;
            if (updateDto.AssignedToEmployeeId.HasValue) defect.AssignedToEmployeeId = updateDto.AssignedToEmployeeId;
            if (updateDto.ResolutionNotes != null) defect.ResolutionNotes = updateDto.ResolutionNotes;
            if (updateDto.AttachmentUrl != null) defect.AttachmentUrl = updateDto.AttachmentUrl;
            if (!string.IsNullOrEmpty(updateDto.Category)) defect.Category = updateDto.Category;

            if (!string.IsNullOrEmpty(updateDto.Status))
            {
                defect.Status = updateDto.Status;
                if (updateDto.Status == "Fixed" || updateDto.Status == "Closed" || updateDto.Status == "Verified Fix")
                    defect.ResolvedDate = DateTime.UtcNow;
            }

            var updated = await _defectRepository.UpdateAsync(defect);

            // Log status change activity
            if (!string.IsNullOrEmpty(updateDto.Status) && oldStatus != updateDto.Status)
            {
                string? performerName = null;
                if (updatedByEmployeeId.HasValue)
                {
                    var performer = await _context.Set<Employee>().FirstOrDefaultAsync(e => e.Id == updatedByEmployeeId.Value);
                    performerName = performer?.EmployeeName;
                }
                await LogActivityAsync("Defect", id, defect.ControlId, "StatusChanged",
                    oldStatus, updateDto.Status,
                    $"Status changed from '{oldStatus}' to '{updateDto.Status}'",
                    updatedByEmployeeId, performerName, defect.TeamId);
            }
            else if (updatedByEmployeeId.HasValue)
            {
                var performer = await _context.Set<Employee>().FirstOrDefaultAsync(e => e.Id == updatedByEmployeeId.Value);
                await LogActivityAsync("Defect", id, defect.ControlId, "Updated",
                    null, null, $"Defect '{defect.Title}' updated",
                    updatedByEmployeeId, performer?.EmployeeName, defect.TeamId);
            }

            var reloaded = await _defectRepository.GetByIdAsync(id);
            return MapToDto(reloaded!);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var defect = await _defectRepository.GetByIdAsync(id);
            if (defect == null) return false;

            await _defectRepository.DeleteAsync(id);
            return true;
        }

        private async Task LogActivityAsync(string entityType, int entityId, int controlId,
            string action, string? oldValue, string? newValue, string? description,
            int? employeeId, string? employeeName, int teamId)
        {
            var log = new ActivityLog
            {
                EntityType = entityType,
                EntityId = entityId,
                ControlId = controlId,
                Action = action,
                OldValue = oldValue,
                NewValue = newValue,
                Description = description,
                PerformedByEmployeeId = employeeId,
                PerformedByName = employeeName,
                Timestamp = DateTime.UtcNow,
                TeamId = teamId
            };
            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ActivityLogDto>> GetActivityLogsAsync(int controlId)
        {
            var logs = await _context.ActivityLogs
                .Where(a => a.ControlId == controlId)
                .OrderByDescending(a => a.Timestamp)
                .Take(50)
                .ToListAsync();

            return logs.Select(a => new ActivityLogDto
            {
                ActivityLogId = a.ActivityLogId,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                ControlId = a.ControlId,
                Action = a.Action,
                OldValue = a.OldValue,
                NewValue = a.NewValue,
                Description = a.Description,
                PerformedByEmployeeId = a.PerformedByEmployeeId,
                PerformedByName = a.PerformedByName,
                Timestamp = a.Timestamp,
                TeamId = a.TeamId
            });
        }

        private DefectDto MapToDto(Defect defect)
        {
            return new DefectDto
            {
                DefectId = defect.DefectId,
                ControlId = defect.ControlId,
                SubDescriptionIndex = defect.SubDescriptionIndex,
                ControlName = defect.Control?.Description,
                Title = defect.Title,
                Description = defect.Description,
                Severity = defect.Severity,
                Status = defect.Status,
                Priority = defect.Priority,
                ReportedByEmployeeId = defect.ReportedByEmployeeId,
                ReportedByName = defect.ReportedBy?.EmployeeName,
                AssignedToEmployeeId = defect.AssignedToEmployeeId,
                AssignedToName = defect.AssignedTo?.EmployeeName,
                ReportedDate = defect.ReportedDate,
                ResolvedDate = defect.ResolvedDate,
                ResolutionNotes = defect.ResolutionNotes,
                AttachmentUrl = defect.AttachmentUrl,
                Category = defect.Category,
                TeamId = defect.TeamId,
                TeamName = defect.Team?.TeamName
            };
        }
    }
}
