using ControlApp.API;
using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public class ControlTypeRepository : Repository<ControlType>, IControlTypeRepository
    {
        public ControlTypeRepository(AppDbContext context) : base(context)
        {
        }
    }
}

