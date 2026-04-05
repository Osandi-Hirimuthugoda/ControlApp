using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ControlApp.API.Models;
using System.Security.Claims;
using ControlApp.API;

namespace ControlApp.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context, ILogger logger)
        {
            try
            {
                // Apply migrations to ensure database schema is up to date
                context.Database.Migrate();
                logger.LogInformation("Database migrations applied successfully");

                // Seed logic
                CleanupDuplicateControlTypes(context, logger);
                EnsureRequiredControlTypes(context, logger);
                EnsureRequiredStatuses(context, logger);
                EnsureDefaultAdminUser(context, logger);
                FixEarlyUpgradeFeeDefects(context, logger);

                context.SaveChanges();
                logger.LogInformation("Database initialization and seeding completed");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during database initialization");
                throw;
            }
        }

        private static void CleanupDuplicateControlTypes(AppDbContext context, ILogger logger)
        {
            var allControlTypes = context.ControlTypes.ToList();
            
            // Remove duplicates for L3 and CR
            RemoveDuplicateTypes(context, allControlTypes, "L3", logger);
            RemoveDuplicateTypes(context, allControlTypes, "CR", logger);
            
            context.SaveChanges();
            
            // Remove unused control types
            var updatedControlTypes = context.ControlTypes.ToList();
            var otherTypes = updatedControlTypes
                .Where(t => t.TypeName != "L3" && t.TypeName != "CR")
                .ToList();
            
            foreach (var otherType in otherTypes)
            {
                var isUsedByControls = context.Controls.Any(c => c.TypeId == otherType.ControlTypeId);
                var isUsedByEmployees = context.Employees.Any(e => e.TypeId == otherType.ControlTypeId);
                
                if (!isUsedByControls && !isUsedByEmployees)
                {
                    context.ControlTypes.Remove(otherType);
                    logger.LogInformation("Removed unused control type: {TypeName}", otherType.TypeName);
                }
            }
        }

        private static void RemoveDuplicateTypes(AppDbContext context, List<ControlType> allTypes, string typeName, ILogger logger)
        {
            var duplicates = allTypes.Where(t => t.TypeName == typeName).ToList();
            if (duplicates.Count <= 1) return;
            
            var firstType = duplicates.First();
            var duplicateTypes = duplicates.Skip(1).ToList();
            
            foreach (var duplicate in duplicateTypes)
            {
                // Reassign references
                var controlsToUpdate = context.Controls.Where(c => c.TypeId == duplicate.ControlTypeId).ToList();
                foreach (var c in controlsToUpdate) c.TypeId = firstType.ControlTypeId;

                var employeesToUpdate = context.Employees.Where(e => e.TypeId == duplicate.ControlTypeId).ToList();
                foreach (var e in employeesToUpdate) e.TypeId = firstType.ControlTypeId;
                
                context.ControlTypes.Remove(duplicate);
                logger.LogInformation("Removed duplicate {TypeName} control type (ID: {Id})", typeName, duplicate.ControlTypeId);
            }
        }

        private static void EnsureRequiredControlTypes(AppDbContext context, ILogger logger)
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

        private static void EnsureRequiredStatuses(AppDbContext context, ILogger logger)
        {
            var requiredStatuses = new[] 
            { 
                new { Name = "Analyze",     Order = 1 },
                new { Name = "HLD",         Order = 2 },
                new { Name = "LLD",         Order = 3 },
                new { Name = "Development", Order = 4 },
                new { Name = "Dev Testing", Order = 5 },
                new { Name = "QA",          Order = 6 },
                new { Name = "On Hold",     Order = 7 },
                new { Name = "Completed",   Order = 8 }
            };

            // Old status names to remove (if no controls reference them)
            var obsoleteNames = new[] { "Not Started", "In Progress", "Testing" };

            var existingStatuses = context.Statuses.ToList();
            bool hasChanges = false;

            // Add or update required statuses
            foreach (var statusDef in requiredStatuses)
            {
                var existing = existingStatuses.FirstOrDefault(s => s.StatusName == statusDef.Name);
                if (existing == null)
                {
                    context.Statuses.Add(new Status 
                    { 
                        StatusName = statusDef.Name,
                        DisplayOrder = statusDef.Order
                    });
                    logger.LogInformation("Created missing status: {StatusName}", statusDef.Name);
                    hasChanges = true;
                }
                else if (existing.DisplayOrder != statusDef.Order)
                {
                    existing.DisplayOrder = statusDef.Order;
                    logger.LogInformation("Updated display order for status: {StatusName}", statusDef.Name);
                    hasChanges = true;
                }
            }

            if (hasChanges) context.SaveChanges();

            // Remove obsolete statuses that have no controls referencing them
            var toRemove = context.Statuses
                .Where(s => obsoleteNames.Contains(s.StatusName))
                .ToList();

            foreach (var old in toRemove)
            {
                bool inUse = context.Controls.Any(c => c.StatusId == old.Id);
                if (!inUse)
                {
                    context.Statuses.Remove(old);
                    logger.LogInformation("Removed obsolete status: {StatusName}", old.StatusName);
                }
                else
                {
                    // Remap controls using obsolete status to "Analyze"
                    var analyzeStatus = context.Statuses.FirstOrDefault(s => s.StatusName == "Analyze");
                    if (analyzeStatus != null)
                    {
                        var affected = context.Controls.Where(c => c.StatusId == old.Id).ToList();
                        foreach (var ctrl in affected) ctrl.StatusId = analyzeStatus.Id;
                        context.Statuses.Remove(old);
                        logger.LogInformation("Remapped {Count} controls from '{Old}' to 'Analyze' and removed old status", affected.Count, old.StatusName);
                    }
                }
            }

            context.SaveChanges();
        }

        private static void EnsureDefaultAdminUser(AppDbContext context, ILogger logger)
        {
            var adminExists = context.Users.Any(u => u.Username == "admin");
            if (!adminExists)
            {
                var passwordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
                context.Add(new User
                {
                    Username = "admin",
                    Email = "admin@controlapp.com",
                    PasswordHash = passwordHash,
                    FullName = "Administrator",
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                });
                logger.LogInformation("Created default admin user");
            }
        }

        private static void FixEarlyUpgradeFeeDefects(AppDbContext context, ILogger logger)
        {
            var targetText = "Early upgrade Fee";
            
            // Find controls whose sub-descriptions contain the target text
            var controlsWithTarget = context.Controls
                .Where(c => c.SubDescriptions != null && c.SubDescriptions.Contains(targetText))
                .ToList();

            if (!controlsWithTarget.Any()) return;

            logger.LogInformation("Data Correction: Found {Count} controls mentioning '{TargetText}'", controlsWithTarget.Count, targetText);

            foreach (var control in controlsWithTarget)
            {
                try
                {
                    // Parse SubDescriptions JSON to find the correct index
                    var subDescs = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.List<System.Text.Json.JsonElement>>(control.SubDescriptions!);
                    if (subDescs == null) continue;

                    int targetIndex = -1;
                    for (int i = 0; i < subDescs.Count; i++)
                    {
                        if (subDescs[i].TryGetProperty("description", out var descProp) && 
                            descProp.GetString()?.Contains(targetText, StringComparison.OrdinalIgnoreCase) == true)
                        {
                            targetIndex = i;
                            break;
                        }
                    }

                    if (targetIndex != -1)
                    {
                        // Map defects that mention the target text but haven't been assigned an index yet
                        var defectsToUpdate = context.Defects
                            .Where(d => d.ControlId == control.ControlId && 
                                        d.SubDescriptionIndex == null && 
                                        (d.Title.Contains(targetText) || (d.Description != null && d.Description.Contains(targetText))))
                            .ToList();

                        if (defectsToUpdate.Any())
                        {
                            foreach (var defect in defectsToUpdate)
                            {
                                defect.SubDescriptionIndex = targetIndex;
                            }
                            logger.LogInformation("Data Correction: Mapped {Count} defects for Control ID {ControlId} to '{TargetText}' (index {Index})", 
                                defectsToUpdate.Count, control.ControlId, targetText, targetIndex);
                        }
                    }
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Data Correction: Failed to parse sub-descriptions for Control ID {ControlId}", control.ControlId);
                }
            }
            
            context.SaveChanges();
        }
    }
}
