namespace ControlApp.API.DTOs
{
    public class StatusDto
    {
        public int Id { get; set; }
        public string StatusName { get; set; } = null!;
    }

    public class CreateStatusDto
    {
        public string StatusName { get; set; } = null!;
    }
}

