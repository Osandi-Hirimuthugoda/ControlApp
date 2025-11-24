namespace ControlApp.API.Models
{
    public class ControlType
    {
        public int ControlTypeId { get; set; } 
        public string TypeName { get; set; } = string.Empty;

        public ICollection<Controls> Controls { get; set; } = new List<Controls>();
    }
}
