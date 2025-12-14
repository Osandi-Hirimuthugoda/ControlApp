namespace ControlApp.API.Models
{
    public class ControlType
    {
        public int ControlTypeId { get; set; } 
        public string TypeName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? ReleaseDate { get; set; }

        public ICollection<Controls> Controls { get; set; } = new List<Controls>();
    }
}
