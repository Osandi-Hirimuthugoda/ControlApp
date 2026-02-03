using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Data.Common;
using ControlApp.API;
using ControlApp.API.Repositories;
using ControlApp.API.Services;
using ControlApp.API.Models;
using System.Text.Json;
using System.Security.Claims;

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
builder.Services.AddScoped<IAuthService, AuthService>();

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


// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForSecurity!";
var issuer = jwtSettings["Issuer"] ?? "ControlAppAPI";
var audience = jwtSettings["Audience"] ?? "ControlAppClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero,
        // Map role claims correctly so [Authorize(Roles)
        RoleClaimType = ClaimTypes.Role
    };
});

builder.Services.AddAuthorization();

// add SWAGGER SERVICES
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Control App API",
        Version = "v1",
        Description = "API for Control Application with JWT Authentication"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

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

// CSS/JS files serve from wwwroot folder
app.UseStaticFiles();

// Enable routing
app.UseRouting();

// Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

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
        
        // Comment this line out after running once to prevent accidental deletions
        //context.Database.EnsureDeleted(); //delete old db - TEMPORARY, comment out after use
        
        // Apply migrations to ensure database schema is up to date
        // This preserves existing data unlike EnsureCreated()
        try
        {
            context.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully");
        }
        catch (Exception migrationEx)
        {
            logger.LogWarning(migrationEx, "Migration failed, attempting EnsureCreated as fallback");
            // Fallback to EnsureCreated if migrations fail (for initial setup)
            if (!context.Database.CanConnect())
            {
                context.Database.EnsureCreated();
                logger.LogInformation("Database created using EnsureCreated");
            }
        }
        
        // Ensure SubDescriptions column exists in Controls table
        EnsureSubDescriptionsColumn(context, logger);
        
        // Ensure Status table exists (handles migration mismatch when DB was partially created)
        EnsureStatusTableExists(context, logger);
        
        // Clean up duplicate control types
        CleanupDuplicateControlTypes(context, logger);
        
        // Ensure required control types exist
        EnsureRequiredControlTypes(context, logger);
        
        // Ensure required statuses exist
        EnsureRequiredStatuses(context, logger);
        
        // Ensure default admin user exists
        EnsureDefaultAdminUser(context, logger);
        
        context.SaveChanges();
        logger.LogInformation("Database cleanup completed");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error during database initialization");
        throw;
    }
}

// Helper method to ensure SubDescriptions column exists
static void EnsureSubDescriptionsColumn(AppDbContext context, ILogger logger)
{
    try
    {
        // Check if SubDescriptions column exists
        var connection = context.Database.GetDbConnection();
        connection.Open();
        
        using var command = connection.CreateCommand();
        command.CommandText = @"
            IF NOT EXISTS (
                SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Controls' 
                AND COLUMN_NAME = 'SubDescriptions'
            )
            BEGIN
                ALTER TABLE Controls
                ADD SubDescriptions NVARCHAR(MAX) NULL;
            END";
        
        command.ExecuteNonQuery();
        connection.Close();
        
        logger.LogInformation("SubDescriptions column verified/added successfully");
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Failed to ensure SubDescriptions column exists, but continuing...");
        // Don't throw - allow the app to continue even if this fails
    }
}

// Helper method to ensure Status table exists (handles DB where migration failed partway)
static void EnsureStatusTableExists(AppDbContext context, ILogger logger)
{
    try
    {
        var connection = context.Database.GetDbConnection();
        connection.Open();
        try
        {
            // Check if Status table exists
            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Status')
                    BEGIN
                        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Statuses')
                        BEGIN
                            -- Rename Statuses to Status and add DisplayOrder if missing
                            EXEC sp_rename 'Statuses', 'Status';
                            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Status' AND COLUMN_NAME = 'DisplayOrder')
                                ALTER TABLE [Status] ADD DisplayOrder INT NOT NULL DEFAULT 0;
                        END
                        ELSE
                        BEGIN
                            CREATE TABLE [Status] (
                                Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
                                StatusName NVARCHAR(MAX) NOT NULL,
                                DisplayOrder INT NOT NULL DEFAULT 0
                            );
                        END
                    END";
                cmd.ExecuteNonQuery();
            }
            logger.LogInformation("Status table verified/created successfully");
        }
        finally
        {
            connection.Close();
        }
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Failed to ensure Status table exists, but continuing...");
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
    
    // Remove invalid control types (not L3 or CR) - but ONLY if they are not being used
    var updatedControlTypes = context.ControlTypes.ToList();
    var finalL3 = updatedControlTypes.FirstOrDefault(t => t.TypeName == "L3");
    var finalCR = updatedControlTypes.FirstOrDefault(t => t.TypeName == "CR");
    
    // Get all control types that are not L3 or CR
    var otherTypes = updatedControlTypes
        .Where(t => t.TypeName != "L3" && t.TypeName != "CR")
        .ToList();
    
    // Only remove types that are NOT being used by any controls or employees
    foreach (var otherType in otherTypes)
    {
        // Check if this type is being used by any controls
        var isUsedByControls = context.Set<Controls>()
            .Any(c => c.TypeId == otherType.ControlTypeId);
        
        // Check if this type is being used by any employees
        var isUsedByEmployees = context.Set<Employee>()
            .Any(e => e.TypeId == otherType.ControlTypeId);
        
        // Only remove if not being used
        if (!isUsedByControls && !isUsedByEmployees)
        {
            context.ControlTypes.Remove(otherType);
            logger.LogInformation("Removed unused control type: {TypeName}", otherType.TypeName);
        }
        else
        {
            logger.LogInformation("Keeping control type {TypeName} as it is in use (Controls: {HasControls}, Employees: {HasEmployees})", 
                otherType.TypeName, isUsedByControls, isUsedByEmployees);
        }
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
        logger.LogInformation("Created missing L3 control Type");
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
    var requiredStatuses = new[] 
    { 
        new { Name = "Analyze", Order = 1 },
        new { Name = "HLD", Order = 2 },
        new { Name = "LLD", Order = 3 },
        new { Name = "Development", Order = 4 },
        new { Name = "Dev Testing", Order = 5 },
        new { Name = "QA", Order = 6 }
    };
    
    var existingStatuses = context.Set<Status>().ToList();
    
    bool hasChanges = false;
    foreach (var statusDef in requiredStatuses)
    {
        var existing = existingStatuses.FirstOrDefault(s => s.StatusName == statusDef.Name);
        if (existing == null)
        {
            context.Set<Status>().Add(new Status 
            { 
                StatusName = statusDef.Name,
                DisplayOrder = statusDef.Order
            });
            logger.LogInformation("Created missing status: {StatusName} with order {Order}", statusDef.Name, statusDef.Order);
            hasChanges = true;
        }
        else if (existing.DisplayOrder != statusDef.Order)
        {
            existing.DisplayOrder = statusDef.Order;
            logger.LogInformation("Updated display order for status: {StatusName} to {Order}", statusDef.Name, statusDef.Order);
            hasChanges = true;
        }
    }
    
    // Save changes immediately if any statuses were added or updated
    if (hasChanges)
    {
        context.SaveChanges();
        logger.LogInformation("Statuses saved to database");
    }
    
    // Log final status count
    var finalCount = context.Set<Status>().Count();
    logger.LogInformation("Total statuses in database: {Count}", finalCount);
}

// Helper method
static void EnsureDefaultAdminUser(AppDbContext context, ILogger logger)
{
    var adminExists = context.Set<User>()
        .Any(u => u.Username == "admin" || u.Email == "admin@controlapp.com");

    if (!adminExists)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
        context.Set<User>().Add(new User
        {
            Username = "admin",
            Email = "admin@controlapp.com",
            PasswordHash = passwordHash,
            FullName = "Administrator",
            Role = "Admin",
            CreatedAt = DateTime.UtcNow
        });
        logger.LogInformation("Created default admin user (username: admin, password: Admin@123)");
    }
}