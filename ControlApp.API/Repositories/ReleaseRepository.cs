using ControlApp.API;
using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public class ReleaseRepository : Repository<Release>, IReleaseRepository
    {
        public ReleaseRepository(AppDbContext context) : base(context)
        {
        }
    }
}

