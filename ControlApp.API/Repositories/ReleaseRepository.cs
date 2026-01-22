using ControlApp.API;
using ControlApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Repositories
{
    public class ReleaseRepository : Repository<Release>, IReleaseRepository
    {
        public ReleaseRepository(AppDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Release>> GetAllAsync()
        {
            return await _context.Releases
                .Include(r => r.Controls)
                .ToListAsync();
        }
    }
}

