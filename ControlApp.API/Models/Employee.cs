namespace ControlApp.API.Models
{
    public class Employee
    {
        public int Id { get; set; } 

        public string EmployeeName { get; set; } = null!;

    
        public ICollection<Controls> Controls { get; set; } = new List<Controls>();
    }
}
