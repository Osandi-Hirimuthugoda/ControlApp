using System;
using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class InsightDto
    {
        public int InsightId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Tags { get; set; }
        public int Priority { get; set; }
        public bool IsActive { get; set; }
        public bool IsPinned { get; set; }
        public int? AuthorId { get; set; }
        public string? AuthorName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedById { get; set; }
        public string? UpdatedByName { get; set; }
        public int? RelatedControlId { get; set; }
        public string? RelatedControlDescription { get; set; }

        // Helper properties
        public string PriorityText => Priority switch
        {
            1 => "Low",
            2 => "Medium", 
            3 => "High",
            4 => "Critical",
            _ => "Unknown"
        };

        public string PriorityColor => Priority switch
        {
            1 => "success",
            2 => "info",
            3 => "warning", 
            4 => "danger",
            _ => "secondary"
        };
    }

    public class CreateInsightDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? Category { get; set; }

        public string? Tags { get; set; }

        [Range(1, 4)]
        public int Priority { get; set; } = 1;

        public bool IsPinned { get; set; } = false;

        public int? AuthorId { get; set; }

        public int? RelatedControlId { get; set; }
    }

    public class UpdateInsightDto
    {
        [Required]
        public int InsightId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? Category { get; set; }

        public string? Tags { get; set; }

        [Range(1, 4)]
        public int Priority { get; set; } = 1;

        public bool IsActive { get; set; } = true;

        public bool IsPinned { get; set; } = false;

        public int? RelatedControlId { get; set; }

        public int? UpdatedById { get; set; }
    }

    public class InsightSummaryDto
    {
        public int TotalInsights { get; set; }
        public int ActiveInsights { get; set; }
        public int PinnedInsightsCount { get; set; }
        public int CriticalInsights { get; set; }
        public List<string> Categories { get; set; } = new List<string>();
        public List<InsightDto> RecentInsights { get; set; } = new List<InsightDto>();
        public List<InsightDto> PinnedInsights { get; set; } = new List<InsightDto>();
    }
}