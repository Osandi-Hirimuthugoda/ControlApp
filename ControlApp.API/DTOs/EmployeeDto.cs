namespace ControlApp.API.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; } = null!;
        public int? TypeId { get; set; }
        public string? TypeName { get; set; }
        public string? Description { get; set; }
    }

    public class CreateEmployeeDto
    {
        public string EmployeeName { get; set; } = null!;
        public int? TypeId { get; set; }
        public string? Description { get; set; }
    }


    public class CreateEmployeeWithControlDto
    {
        public string EmployeeName { get; set; } = string.Empty;
        public string? Description { get; set; } 
        public int? TypeId { get; set; } 
    }
}