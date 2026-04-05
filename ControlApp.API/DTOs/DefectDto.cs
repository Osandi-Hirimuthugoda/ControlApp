namespace ControlApp.API.DTOs
{
    public class DefectDto
    {
        public int DefectId { get; set; }
        public int ControlId { get; set; }
        public int? SubDescriptionIndex { get; set; }
        public string? ControlName { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Severity { get; set; } = "Medium";
        public string Status { get; set; } = "Open";
        public string Priority { get; set; } = "Medium";
        public int? ReportedByEmployeeId { get; set; }
        public string? ReportedByName { get; set; }
        public int? AssignedToEmployeeId { get; set; }
        public string? AssignedToName { get; set; }
        public DateTime ReportedDate { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public string? ResolutionNotes { get; set; }
        public string? AttachmentUrl { get; set; }
        public List<string>? AttachmentUrls { get; set; }
        public string? Category { get; set; }
        public int TeamId { get; set; }
        public string? TeamName { get; set; }
    }

    public class CreateDefectDto
    {
        public int ControlId { get; set; }
        public int? SubDescriptionIndex { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Severity { get; set; } = "Medium";
        public string Priority { get; set; } = "Medium";
        public int? AssignedToEmployeeId { get; set; }
        public string? Category { get; set; }
        public List<string>? AttachmentUrls { get; set; }
        public string? AttachmentUrl { get; set; }
    }

    public class UpdateDefectDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Severity { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public int? AssignedToEmployeeId { get; set; }
        public string? ResolutionNotes { get; set; }
        public string? Category { get; set; }
        public List<string>? AttachmentUrls { get; set; }
        public string? AttachmentUrl { get; set; }
        public int? SubDescriptionIndex { get; set; }
    }
}
