using Microsoft.EntityFrameworkCore;
using ControlApp.API.Models;


namespace ControlApp.API
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
            public DbSet<ControlType> ControlTypes { get; set; }
            public DbSet<Controls> Controls { get; set; }
            public DbSet<Employee> Employees { get; set; }
            public DbSet<Status> Statuses { get; set; }
            public DbSet<Release> Releases { get; set; }
            public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<Controls>(entity =>
            {
                entity.HasKey(e => e.ControlId);
                
                
                entity.HasOne(c => c.Type)
                    .WithMany(t => t.Controls)
                    .HasForeignKey(c => c.TypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Employee)
                    .WithMany(e => e.Controls)
                    .HasForeignKey(c => c.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Status)
                    .WithMany(s => s.Controls)
                    .HasForeignKey(c => c.StatusId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Release)
                    .WithMany(r => r.Controls)
                    .HasForeignKey(c => c.ReleaseId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            
            modelBuilder.Entity<ControlType>(entity =>
            {
                entity.HasKey(e => e.ControlTypeId);
            });

            
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.Type)
                    .WithMany()
                    .HasForeignKey(e => e.TypeId)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            
            modelBuilder.Entity<Status>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

        
            modelBuilder.Entity<Release>(entity =>
            {
                entity.HasKey(e => e.ReleaseId);
            });
        }

    }
}
