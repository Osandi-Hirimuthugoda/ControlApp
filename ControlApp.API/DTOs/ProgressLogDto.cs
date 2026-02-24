using System;
using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class ProgressLogDto
    {
        public int ProgressLogId { get; set; }
        public int ControlId { get; set; }
        public int Progress { get; set; }
        public int? StatusId { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime LogDate { get; set; }
        public string? Comments { get; set; }
        public string? WorkDescription { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties for display
        public string? StatusName { get; set; }
        public string? EmployeeName { get; set; }
        public string? ControlDescription { get; set; }
    }

    public class CreateProgressLogDto
    {
        [Required]
        public int ControlId { get; set; }

        [Required]
        [Range(0, 100)]
        public int Progress { get; set; }

        public int? StatusId { get; set; }

        public int? EmployeeId { get; set; }

        [Required]
        public DateTime LogDate { get; set; }

        public string? Comments { get; set; }

        public string? WorkDescription { get; set; }
    }

    public class DailyProgressSummaryDto
    {
        public DateTime Date { get; set; }
        public int TotalControls { get; set; }
        public int UpdatedControls { get; set; }
        public double AverageProgress { get; set; }
        public List<ProgressLogDto> ProgressLogs { get; set; } = new List<ProgressLogDto>();
    }
}