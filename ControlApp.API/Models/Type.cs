namespace ControlApp.API.Models
{
    public class Type
    {
        public int TypeId { get; set; } 

        public string Type_Name { get; set; } = string.Empty;

        public ICollection<Controls> Controls { get; set; } = new List<Controls>();
    }
}
