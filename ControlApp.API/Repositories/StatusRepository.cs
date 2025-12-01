using ControlApp.API;
using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public class StatusRepository : Repository<Status>, IStatusRepository
    {
        public StatusRepository(AppDbContext context) : base(context)
        {
        }
    }
}

