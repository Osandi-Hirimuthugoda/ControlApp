using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControlApp.API.Models
{
    public class ProgressLog
    {
        [Key]
        public int ProgressLogId { get; set; }

        [Required]
        public int ControlId { get; set; }

        [Required]
        public int Progress { get; set; } // Progress percentage (0-100)

        public int? StatusId { get; set; } // Status at the time of progress update

        public int? EmployeeId { get; set; } // Employee who made the update

        [Required]
        public DateTime LogDate { get; set; } // Date of the progress update

        public string? Comments { get; set; } // Daily comments/notes

        public string? WorkDescription { get; set; } // What work was done

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ControlId")]
        public Controls? Control { get; set; }

        [ForeignKey("StatusId")]
        public Status? Status { get; set; }

        [ForeignKey("EmployeeId")]
        public Employee? Employee { get; set; }
    }
}