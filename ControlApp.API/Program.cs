using Microsoft.EntityFrameworkCore;
using ControlApp.API;
using ControlApp.API.Repositories;
using ControlApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
 
// Register Repositories
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IControlRepository, ControlRepository>();
builder.Services.AddScoped<IControlTypeRepository, ControlTypeRepository>();
builder.Services.AddScoped<IStatusRepository, StatusRepository>();
builder.Services.AddScoped<IReleaseRepository, ReleaseRepository>();

// Register Services
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IControlService, ControlService>();
builder.Services.AddScoped<IControlTypeService, ControlTypeService>();
builder.Services.AddScoped<IStatusService, StatusService>();
builder.Services.AddScoped<IReleaseService, ReleaseService>();

// Add Controllers with JSON camelCase support
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Add OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS
app.UseCors("AllowAll");

// Enable static files (for AngularJS frontend)
app.UseStaticFiles();

// Enable routing
app.UseRouting();

// Map controllers
app.MapControllers();

// Default route to index.html
app.MapFallbackToFile("index.html");

app.Run();
