namespace ControlApp.API.Models
{
    public class Status
    {
        public int Id { get; set; }
        public string StatusName { get; set; } = null!;
        public int DisplayOrder { get; set; }
        public ICollection<Controls> Controls { get; set; } = new List<Controls>();

    }
}
