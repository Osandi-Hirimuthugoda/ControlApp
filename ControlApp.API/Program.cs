using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ControlApp.API;
using ControlApp.API.Repositories;
using ControlApp.API.Services;
using ControlApp.API.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

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

// Add Controllers with JSON camelCase support and validation
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        // Return detailed validation errors
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(e => new
                {
                    field = x.Key,
                    message = e.ErrorMessage
                }))
                .ToList();

            return new BadRequestObjectResult(new
            {
                error = "Validation failed",
                errors = errors
            });
        };
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


// add SWAGGER SERVICES
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Global Error Handling Middleware
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        
        var errorResponse = new
        {
            error = "An internal server error occurred",
            message = app.Environment.IsDevelopment() ? ex.Message : "Please contact support if the problem persists"
        };
        
        await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }
});

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // SWAGGER MIDDLEWARE 
    app.UseSwagger();
    app.UseSwaggerUI(); 
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

// Initialize and clean up database
InitializeDatabase(app);

app.Run();

// Helper method to initialize and clean up database
static void InitializeDatabase(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Ensure database is created
        context.Database.EnsureCreated();
        logger.LogInformation("Database initialized successfully");
        
        // Clean up duplicate control types
        CleanupDuplicateControlTypes(context, logger);
        
        // Ensure required control types exist
        EnsureRequiredControlTypes(context, logger);
        
        // Ensure required statuses exist
        EnsureRequiredStatuses(context, logger);
        
        context.SaveChanges();
        logger.LogInformation("Database cleanup completed");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error during database initialization");
        throw;
    }
}

// Helper method to remove duplicate control types
static void CleanupDuplicateControlTypes(AppDbContext context, ILogger logger)
{
    var allControlTypes = context.ControlTypes.ToList();
    
    // Remove duplicates for L3 and CR
    RemoveDuplicateTypes(context, allControlTypes, "L3", logger);
    RemoveDuplicateTypes(context, allControlTypes, "CR", logger);
    
    context.SaveChanges();
    
    // Remove invalid control types (not L3 or CR)
    var updatedControlTypes = context.ControlTypes.ToList();
    var finalL3 = updatedControlTypes.FirstOrDefault(t => t.TypeName == "L3");
    var finalCR = updatedControlTypes.FirstOrDefault(t => t.TypeName == "CR");
    
    var invalidTypes = updatedControlTypes
        .Where(t => t.TypeName != "L3" && t.TypeName != "CR")
        .ToList();
    
    foreach (var invalidType in invalidTypes)
    {
        var defaultType = finalCR ?? finalL3;
        if (defaultType != null)
        {
            // Reassign controls and employees to default type
            ReassignReferences(context, invalidType.ControlTypeId, defaultType.ControlTypeId);
        }
        
        context.ControlTypes.Remove(invalidType);
        logger.LogInformation("Removed invalid control type: {TypeName}", invalidType.TypeName);
    }
}

// Helper method to remove duplicate types of a specific name
static void RemoveDuplicateTypes(AppDbContext context, List<ControlType> allTypes, string typeName, ILogger logger)
{
    var duplicates = allTypes.Where(t => t.TypeName == typeName).ToList();
    
    if (duplicates.Count <= 1) return;
    
    var firstType = duplicates.First();
    var duplicateTypes = duplicates.Skip(1).ToList();
    
    foreach (var duplicate in duplicateTypes)
    {
        // Reassign references to the first type
        ReassignReferences(context, duplicate.ControlTypeId, firstType.ControlTypeId);
        
        context.ControlTypes.Remove(duplicate);
        logger.LogInformation("Removed duplicate {TypeName} control type (ID: {Id})", typeName, duplicate.ControlTypeId);
    }
}

// Helper method to reassign references from one type to another
static void ReassignReferences(AppDbContext context, int oldTypeId, int newTypeId)
{
    // Update controls
    var controlsToUpdate = context.Set<Controls>()
        .Where(c => c.TypeId == oldTypeId)
        .ToList();
    
    foreach (var control in controlsToUpdate)
    {
        control.TypeId = newTypeId;
    }
    
    // Update employees
    var employeesToUpdate = context.Set<Employee>()
        .Where(e => e.TypeId == oldTypeId)
        .ToList();
    
    foreach (var employee in employeesToUpdate)
    {
        employee.TypeId = newTypeId;
    }
}

// Helper method to ensure required control types exist
static void EnsureRequiredControlTypes(AppDbContext context, ILogger logger)
{
    var existingTypes = context.ControlTypes.Select(t => t.TypeName).ToList();
    
    if (!existingTypes.Contains("L3"))
    {
        context.ControlTypes.Add(new ControlType { TypeName = "L3" });
        logger.LogInformation("Created missing L3 control type");
    }
    
    if (!existingTypes.Contains("CR"))
    {
        context.ControlTypes.Add(new ControlType { TypeName = "CR" });
        logger.LogInformation("Created missing CR control type");
    }
}

// Helper method to ensure required statuses exist
static void EnsureRequiredStatuses(AppDbContext context, ILogger logger)
{
    var requiredStatuses = new[] { "Analyze", "Development", "Dev Testing", "QA" };
    var existingStatuses = context.Set<Status>().Select(s => s.StatusName).ToList();
    
    bool hasChanges = false;
    foreach (var statusName in requiredStatuses)
    {
        if (!existingStatuses.Contains(statusName))
        {
            context.Set<Status>().Add(new Status { StatusName = statusName });
            logger.LogInformation("Created missing status: {StatusName}", statusName);
            hasChanges = true;
        }
    }
    
    // Save changes immediately if any statuses were added
    if (hasChanges)
    {
        context.SaveChanges();
        logger.LogInformation("Statuses saved to database");
    }
    
    // Log final status count
    var finalCount = context.Set<Status>().Count();
    logger.LogInformation("Total statuses in database: {Count}", finalCount);
}