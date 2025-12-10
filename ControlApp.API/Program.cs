using Microsoft.EntityFrameworkCore;
using ControlApp.API;
using ControlApp.API.Repositories;
using ControlApp.API.Services;
using ControlApp.API.Models;

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


// add SWAGGER SERVICES
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

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

// Seed Control Types (L3 and CR) - Remove duplicates and ensure only one of each
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Ensure database is created
    context.Database.EnsureCreated();
    
    // Get all control types
    var allControlTypes = context.ControlTypes.ToList();
    
    // Find duplicates for L3 and CR
    var l3Types = allControlTypes.Where(t => t.TypeName == "L3").ToList();
    var crTypes = allControlTypes.Where(t => t.TypeName == "CR").ToList();
    
    // Keep the first one of each, remove duplicates
    if (l3Types.Count > 1)
    {
        var firstL3 = l3Types.First();
        var duplicateL3s = l3Types.Skip(1).ToList();
        
        // Check if any controls are using the duplicate L3 types
        foreach (var duplicate in duplicateL3s)
        {
            var controlsUsingThis = context.Set<Controls>().Any(c => c.TypeId == duplicate.ControlTypeId);
            var employeesUsingThis = context.Set<Employee>().Any(e => e.TypeId == duplicate.ControlTypeId);
            
            if (controlsUsingThis || employeesUsingThis)
            {
                // If controls/employees are using this duplicate, update them to use the first L3
                var controlsToUpdate = context.Set<Controls>().Where(c => c.TypeId == duplicate.ControlTypeId).ToList();
                foreach (var control in controlsToUpdate)
                {
                    control.TypeId = firstL3.ControlTypeId;
                }
                
                var employeesToUpdate = context.Set<Employee>().Where(e => e.TypeId == duplicate.ControlTypeId).ToList();
                foreach (var employee in employeesToUpdate)
                {
                    employee.TypeId = firstL3.ControlTypeId;
                }
            }
            
            context.ControlTypes.Remove(duplicate);
        }
    }
    
    if (crTypes.Count > 1)
    {
        var firstCR = crTypes.First();
        var duplicateCRs = crTypes.Skip(1).ToList();
        
        // Check if any controls are using the duplicate CR types
        foreach (var duplicate in duplicateCRs)
        {
            var controlsUsingThis = context.Set<Controls>().Any(c => c.TypeId == duplicate.ControlTypeId);
            var employeesUsingThis = context.Set<Employee>().Any(e => e.TypeId == duplicate.ControlTypeId);
            
            if (controlsUsingThis || employeesUsingThis)
            {
                // If controls/employees are using this duplicate, update them to use the first CR
                var controlsToUpdate = context.Set<Controls>().Where(c => c.TypeId == duplicate.ControlTypeId).ToList();
                foreach (var control in controlsToUpdate)
                {
                    control.TypeId = firstCR.ControlTypeId;
                }
                
                var employeesToUpdate = context.Set<Employee>().Where(e => e.TypeId == duplicate.ControlTypeId).ToList();
                foreach (var employee in employeesToUpdate)
                {
                    employee.TypeId = firstCR.ControlTypeId;
                }
            }
            
            context.ControlTypes.Remove(duplicate);
        }
    }
    
    // Save changes after removing duplicates
    context.SaveChanges();
    
    // Get updated list after duplicate removal
    var updatedControlTypes = context.ControlTypes.ToList();
    var finalL3 = updatedControlTypes.FirstOrDefault(t => t.TypeName == "L3");
    var finalCR = updatedControlTypes.FirstOrDefault(t => t.TypeName == "CR");
    
    // Remove any control types that are NOT L3 or CR
    var typesToRemove = updatedControlTypes.Where(t => t.TypeName != "L3" && t.TypeName != "CR").ToList();
    
    foreach (var typeToRemove in typesToRemove)
    {
        // Check if any controls or employees are using this type
        var controlsUsingThis = context.Set<Controls>().Any(c => c.TypeId == typeToRemove.ControlTypeId);
        var employeesUsingThis = context.Set<Employee>().Any(e => e.TypeId == typeToRemove.ControlTypeId);
        
        if (controlsUsingThis || employeesUsingThis)
        {
            // If being used, assign to CR (default) or L3 if available
            var defaultType = finalCR ?? finalL3;
            if (defaultType != null)
            {
                var controlsToUpdate = context.Set<Controls>().Where(c => c.TypeId == typeToRemove.ControlTypeId).ToList();
                foreach (var control in controlsToUpdate)
                {
                    control.TypeId = defaultType.ControlTypeId;
                }
                
                var employeesToUpdate = context.Set<Employee>().Where(e => e.TypeId == typeToRemove.ControlTypeId).ToList();
                foreach (var employee in employeesToUpdate)
                {
                    employee.TypeId = defaultType.ControlTypeId;
                }
            }
        }
        
        context.ControlTypes.Remove(typeToRemove);
    }
    
    var remainingTypes = context.ControlTypes.Select(t => t.TypeName).ToList();
    
    if (!remainingTypes.Contains("L3"))
    {
        context.ControlTypes.Add(new ControlType { TypeName = "L3" });
    }
    
    if (!remainingTypes.Contains("CR"))
    {
        context.ControlTypes.Add(new ControlType { TypeName = "CR" });
    }
    
    context.SaveChanges();
}

app.Run();