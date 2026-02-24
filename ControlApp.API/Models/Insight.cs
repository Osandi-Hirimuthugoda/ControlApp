using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControlApp.API.Models
{
    public class Insight
    {
        [Key]
        public int InsightId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? Category { get; set; } // e.g., "Technical", "Process", "Team", "Performance"

        public string? Tags { get; set; } // Comma-separated tags

        public int Priority { get; set; } = 1; // 1=Low, 2=Medium, 3=High, 4=Critical

        public bool IsActive { get; set; } = true;

        public bool IsPinned { get; set; } = false; // For important insights

        public int? AuthorId { get; set; } // Employee who created the insight

        [ForeignKey("AuthorId")]
        public Employee? Author { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int? UpdatedById { get; set; } // Employee who last updated

        [ForeignKey("UpdatedById")]
        public Employee? UpdatedBy { get; set; }

        // Optional: Link to specific control/project
        public int? RelatedControlId { get; set; }

        [ForeignKey("RelatedControlId")]
        public Controls? RelatedControl { get; set; }
    }
}