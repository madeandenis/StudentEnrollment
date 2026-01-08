using Microsoft.AspNetCore.Identity;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.Persistence.Seeders.Contracts;

namespace StudentEnrollment.Shared.Persistence.Seeders;

/// <summary>
/// Handles seeding of roles into the Identity system.
/// </summary>
public class RoleSeeder(
    ILogger<RoleSeeder> logger,
    RoleManager<ApplicationRole> roleManager
) : ISeeder
{
    /// <summary>
    /// Ensures the required roles exist in the system.
    /// Safe to run multiple times.
    /// </summary>
    public async Task SeedAsync()
    {
        var roleNames = new[] { "SuAdmin", "Admin" };
        foreach (var roleName in roleNames)
        {
            if (await roleManager.RoleExistsAsync(roleName))
                continue;
            
            var newRole = new ApplicationRole { Name = roleName };
            var createResult = await roleManager.CreateAsync(newRole);
            
            if (!createResult.Succeeded)
            {
                var errors = createResult.Errors.Select(e => e.Description).ToArray();
                logger.LogError(
                    "Failed to create role '{Role}': {Errors}",
                    roleName,
                    string.Join(", ", errors)
                );

                throw new InvalidOperationException(
                    $"Failed to seed role '{roleName}'.",
                    new AggregateException(errors.Select(e => new InvalidOperationException(e)))
                );
            }
        }
        
        logger.LogInformation("Seeding completed!");
    }
}