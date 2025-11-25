namespace ControlApp.API.DTOs
{
    public class ControlTypeDto
    {
        public int ControlTypeId { get; set; }
        public string TypeName { get; set; } = string.Empty;
    }

    public class CreateControlTypeDto
    {
        public string TypeName { get; set; } = string.Empty;
    }
}

