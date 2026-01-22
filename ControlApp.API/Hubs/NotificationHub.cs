using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace ControlApp.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public async Task SendNotificationToUser(string userId, string message, string type)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", message, type);
        }

        public async Task SendNotificationToAll(string message, string type)
        {
            await Clients.All.SendAsync("ReceiveNotification", message, type);
        }

        public async Task SendDefectAssigned(string userId, string defectTitle, int defectId)
        {
            await Clients.User(userId).SendAsync("DefectAssigned", defectTitle, defectId);
        }

        public async Task SendQAAssigned(string userId, string controlDescription, int controlId)
        {
            await Clients.User(userId).SendAsync("QAAssigned", controlDescription, controlId);
        }

        public async Task SendDefectStatusChanged(string userId, string defectTitle, int defectId, int controlId, string newStatus)
        {
            await Clients.User(userId).SendAsync("DefectStatusChanged", defectTitle, defectId, controlId, newStatus);
        }

        public async Task SendTestCaseFailed(string userId, string testCaseTitle, int testCaseId)
        {
            await Clients.User(userId).SendAsync("TestCaseFailed", testCaseTitle, testCaseId);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine($"User {userId} connected to SignalR");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine($"User {userId} disconnected from SignalR");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
