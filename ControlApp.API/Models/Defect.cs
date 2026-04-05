using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControlApp.API.Models
{
    public class Defect : ISoftDelete
    {
        [Key]
        public int DefectId { get; set; }

        [Required]
        public int ControlId { get; set; }

        public int? SubDescriptionIndex { get; set; } // null = control-level, 0+ = sub-description index

        [ForeignKey("ControlId")]
        public Controls Control { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        [StringLength(50)]
        public string Severity { get; set; } = "Medium"; // Critical, High, Medium, Low

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Open"; // Open, In Progress, Fixed, Closed, Rejected

        [Required]
        [StringLength(50)]
        public string Priority { get; set; } = "Medium"; // Critical, High, Medium, Low

        public int? ReportedByEmployeeId { get; set; }

        [ForeignKey("ReportedByEmployeeId")]
        public Employee? ReportedBy { get; set; }

        public int? AssignedToEmployeeId { get; set; }

        [ForeignKey("AssignedToEmployeeId")]
        public Employee? AssignedTo { get; set; }

        public DateTime ReportedDate { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedDate { get; set; }

        [StringLength(500)]
        public string? ResolutionNotes { get; set; }

        // Store image as base64 string or file path
        public string? AttachmentUrl { get; set; }

        // Store multiple images as JSON array
        public string? AttachmentUrls { get; set; }

        [StringLength(50)]
        public string? Category { get; set; } // Functional, Environmental, Requirement Gaps

        public int TeamId { get; set; }

        [ForeignKey("TeamId")]
        public Team Team { get; set; } = null!;

        public bool IsDeleted { get; set; } = false;
    }
}
