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
            public DbSet<ProgressLog> ProgressLogs { get; set; }
            public DbSet<Insight> Insights { get; set; }
            public DbSet<Team> Teams { get; set; }
            public DbSet<UserTeam> UserTeams { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<Controls>(entity =>
            {
                entity.HasKey(e => e.ControlId);
                
                // Configure SubDescriptions - nullable column
                entity.Property(e => e.SubDescriptions)
                    .HasColumnName("SubDescriptions")
                    .HasColumnType("nvarchar(max)")
                    .IsRequired(false);
                
                entity.HasOne(c => c.Type)
                    .WithMany(t => t.Controls)
                    .HasForeignKey(c => c.TypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Employee)
                    .WithMany(e => e.Controls)
                    .HasForeignKey(c => c.EmployeeId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(c => c.QAEmployee)
                    .WithMany()
                    .HasForeignKey(c => c.QAEmployeeId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.NoAction);

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
                entity.ToTable("Status"); // Map to 'Status' table instead of 'Statuses'
                entity.HasKey(e => e.Id);
            });

        
            modelBuilder.Entity<Release>(entity =>
            {
                entity.HasKey(e => e.ReleaseId);
            });

            // Configure ProgressLog entity
            modelBuilder.Entity<ProgressLog>(entity =>
            {
                entity.HasKey(e => e.ProgressLogId);
                
                entity.HasOne(p => p.Control)
                    .WithMany()
                    .HasForeignKey(p => p.ControlId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(p => p.Status)
                    .WithMany()
                    .HasForeignKey(p => p.StatusId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(p => p.Employee)
                    .WithMany()
                    .HasForeignKey(p => p.EmployeeId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                // Index for efficient querying by control and date
                entity.HasIndex(p => new { p.ControlId, p.LogDate });
            });

            // Configure Insight entity
            modelBuilder.Entity<Insight>(entity =>
            {
                entity.HasKey(e => e.InsightId);
                
                entity.HasOne(i => i.Author)
                    .WithMany()
                    .HasForeignKey(i => i.AuthorId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(i => i.UpdatedBy)
                    .WithMany()
                    .HasForeignKey(i => i.UpdatedById)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(i => i.RelatedControl)
                    .WithMany()
                    .HasForeignKey(i => i.RelatedControlId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);

                // Indexes for efficient querying
                entity.HasIndex(i => i.Category);
                entity.HasIndex(i => i.Priority);
                entity.HasIndex(i => i.CreatedAt);
                entity.HasIndex(i => i.IsActive);
                entity.HasIndex(i => i.IsPinned);
            });

            // Configure Team entity
            modelBuilder.Entity<Team>(entity =>
            {
                entity.ToTable("Teams", "osandi"); // Specify schema
                entity.HasKey(e => e.TeamId);
                
                entity.HasIndex(e => e.TeamCode).IsUnique();
                
                entity.Property(e => e.TeamName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.TeamCode).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Description).HasMaxLength(500);
                
                // Team Leadership relationships - use NoAction to avoid cascade cycles
                entity.HasOne(t => t.Architect)
                    .WithMany()
                    .HasForeignKey(t => t.ArchitectId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.NoAction);
                
                entity.HasOne(t => t.ProjectManager)
                    .WithMany()
                    .HasForeignKey(t => t.ProjectManagerId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.NoAction);
                
                entity.HasOne(t => t.TeamLead)
                    .WithMany()
                    .HasForeignKey(t => t.TeamLeadId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            // Configure UserTeam junction table
            modelBuilder.Entity<UserTeam>(entity =>
            {
                entity.HasKey(ut => ut.Id);
                
                entity.HasOne(ut => ut.User)
                    .WithMany(u => u.UserTeams)
                    .HasForeignKey(ut => ut.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(ut => ut.Team)
                    .WithMany(t => t.UserTeams)
                    .HasForeignKey(ut => ut.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Unique constraint: A user can only be assigned to a team once
                entity.HasIndex(ut => new { ut.UserId, ut.TeamId }).IsUnique();
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasOne(e => e.Team)
                    .WithMany()
                    .HasForeignKey(e => e.TeamId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Controls>(entity =>
            {
                entity.HasOne(c => c.Team)
                    .WithMany()
                    .HasForeignKey(c => c.TeamId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<ControlType>(entity =>
            {
                entity.HasOne(ct => ct.Team)
                    .WithMany()
                    .HasForeignKey(ct => ct.TeamId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }

    }
}
