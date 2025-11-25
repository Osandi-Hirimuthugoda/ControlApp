namespace ControlApp.API.DTOs
{
    public class ControlDto
    {
        public int ControlId { get; set; }
        public string Description { get; set; } = null!;
        public string Comments { get; set; } = null!;
        public int TypeId { get; set; }
        public string? TypeName { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public int StatusId { get; set; }
        public string? StatusName { get; set; }
        public int ReleaseId { get; set; }
        public string? ReleaseName { get; set; }
    }

    public class CreateControlDto
    {
        public string Description { get; set; } = null!;
        public string Comments { get; set; } = null!;
        public int TypeId { get; set; }
        public int EmployeeId { get; set; }
        public int StatusId { get; set; }
        public int ReleaseId { get; set; }
    }

    public class UpdateControlDto
    {
        public string Description { get; set; } = null!;
        public string Comments { get; set; } = null!;
        public int TypeId { get; set; }
        public int EmployeeId { get; set; }
        public int StatusId { get; set; }
        public int ReleaseId { get; set; }
    }
}

