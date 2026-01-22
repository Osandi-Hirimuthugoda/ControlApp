using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ControlApp.API.Hubs
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            // Get the user ID from the NameIdentifier claim
            var userId = connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"SignalR GetUserId: {userId}");
            return userId;
        }
    }
}
