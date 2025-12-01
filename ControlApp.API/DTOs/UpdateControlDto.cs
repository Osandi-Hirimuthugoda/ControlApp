namespace ControlApp.API.DTOs
{
    public class UpdateControlDto
    {
        public int ControlId { get; set; } 
        public int EmployeeId { get; set; } 

        
        public int? TypeId { get; set; }
        public string? Description { get; set; }
        public string? Comments { get; set; }
        
        
        public int Progress { get; set; }

        public int? StatusId { get; set; }
        public int? ReleaseId { get; set; }
        public DateTime? ReleaseDate { get; set; }
    }
}