namespace ControlApp.API.DTOs
{
    public class ControlTypeDto
    {
        public int ControlTypeId { get; set; }
        public string TypeName { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? ReleaseDate { get; set; }
    }

    public class CreateControlTypeDto
    {
        public string TypeName { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? ReleaseDate { get; set; }
    }
}
