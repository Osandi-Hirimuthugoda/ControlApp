namespace ControlApp.API.DTOs
{
    public class LogSubDescActivityDto
    {
        public string? SubDescription { get; set; }
        public string? OldStatus { get; set; }
        public string? NewStatus { get; set; }
        public int? PerformedByEmployeeId { get; set; }
        public string? PerformedByName { get; set; }
    }
}
