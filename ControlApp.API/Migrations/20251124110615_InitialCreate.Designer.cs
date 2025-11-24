
using System;
using ControlApp.API;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ControlApp.API.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20251124110615_InitialCreate")]
    partial class InitialCreate
    {
        
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "10.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("ControlApp.API.Models.ControlType", b =>
                {
                    b.Property<int>("ControlTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ControlTypeId"));

                    b.Property<string>("TypeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ControlTypeId");

                    b.ToTable("ControlTypes");
                });

            modelBuilder.Entity("ControlApp.API.Models.Controls", b =>
                {
                    b.Property<int>("ControlId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ControlId"));

                    b.Property<string>("Comments")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("EmployeeId")
                        .HasColumnType("int");

                    b.Property<int>("ReleaseId")
                        .HasColumnType("int");

                    b.Property<int>("StatusId")
                        .HasColumnType("int");

                    b.Property<int>("TypeId")
                        .HasColumnType("int");

                    b.HasKey("ControlId");

                    b.HasIndex("EmployeeId");

                    b.HasIndex("ReleaseId");

                    b.HasIndex("StatusId");

                    b.HasIndex("TypeId");

                    b.ToTable("Controls");
                });

            modelBuilder.Entity("ControlApp.API.Models.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("EmployeeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("ControlApp.API.Models.Release", b =>
                {
                    b.Property<int>("ReleaseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReleaseId"));

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("ReleaseName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ReleaseId");

                    b.ToTable("Releases");
                });

            modelBuilder.Entity("ControlApp.API.Models.Status", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("StatusName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Statuses");
                });

            modelBuilder.Entity("ControlApp.API.Models.Controls", b =>
                {
                    b.HasOne("ControlApp.API.Models.Employee", "Employee")
                        .WithMany("Controls")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ControlApp.API.Models.Release", "Release")
                        .WithMany("Controls")
                        .HasForeignKey("ReleaseId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ControlApp.API.Models.Status", "Status")
                        .WithMany("Controls")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ControlApp.API.Models.ControlType", "Type")
                        .WithMany("Controls")
                        .HasForeignKey("TypeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Release");

                    b.Navigation("Status");

                    b.Navigation("Type");
                });

            modelBuilder.Entity("ControlApp.API.Models.ControlType", b =>
                {
                    b.Navigation("Controls");
                });

            modelBuilder.Entity("ControlApp.API.Models.Employee", b =>
                {
                    b.Navigation("Controls");
                });

            modelBuilder.Entity("ControlApp.API.Models.Release", b =>
                {
                    b.Navigation("Controls");
                });

            modelBuilder.Entity("ControlApp.API.Models.Status", b =>
                {
                    b.Navigation("Controls");
                });
#pragma warning restore 612, 618
        }
    }
}
