namespace ControlApp.API.DTOs
{
    public class ActivityLogDto
    {
        public int ActivityLogId { get; set; }
        public string EntityType { get; set; } = string.Empty;
        public int EntityId { get; set; }
        public int ControlId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string? Description { get; set; }
        public int? PerformedByEmployeeId { get; set; }
        public string? PerformedByName { get; set; }
        public DateTime Timestamp { get; set; }
        public int TeamId { get; set; }
    }
}
