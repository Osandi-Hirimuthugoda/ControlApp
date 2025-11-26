using Microsoft.EntityFrameworkCore;
using ControlApp.API;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using ControlApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register Repositories
builder.Services.AddScoped<IControlRepository, ControlRepository>();
builder.Services.AddScoped<IControlTypeRepository, ControlTypeRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IStatusRepository, StatusRepository>();
builder.Services.AddScoped<IReleaseRepository, ReleaseRepository>();

// Register Services
builder.Services.AddScoped<IControlService, ControlService>();
builder.Services.AddScoped<IControlTypeService, ControlTypeService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IStatusService, StatusService>();
builder.Services.AddScoped<IReleaseService, ReleaseService>();

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Seed Employees if they don't exist
    if (!context.Employees.Any())
    {
        var employees = new[]
        {
            new Employee { EmployeeName = "Chinthana" },
            new Employee { EmployeeName = "Chamila" },
            new Employee { EmployeeName = "Chathuranga" },
            new Employee { EmployeeName = "Shihan" }
        };
        
        context.Employees.AddRange(employees);
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
