namespace ControlApp.API.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; } = null!;
    }

    public class CreateEmployeeDto
    {
        public string EmployeeName { get; set; } = null!;
    }
}

