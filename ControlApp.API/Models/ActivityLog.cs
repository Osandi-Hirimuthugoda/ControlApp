using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControlApp.API.Models
{
    public class ActivityLog
    {
        [Key]
        public int ActivityLogId { get; set; }

        [Required]
        [StringLength(20)]
        public string EntityType { get; set; } = string.Empty; // "Defect" or "TestCase"

        public int EntityId { get; set; } // DefectId or TestCaseId

        public int ControlId { get; set; }

        [ForeignKey("ControlId")]
        public Controls Control { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // "Created", "StatusChanged", "Updated", "Deleted"

        [StringLength(100)]
        public string? OldValue { get; set; }

        [StringLength(100)]
        public string? NewValue { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public int? PerformedByEmployeeId { get; set; }

        [ForeignKey("PerformedByEmployeeId")]
        public Employee? PerformedBy { get; set; }

        [StringLength(100)]
        public string? PerformedByName { get; set; } // Denormalized for display

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public int TeamId { get; set; }
    }
}
