using Microsoft.AspNetCore.Identity;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.Persistence.Seeds.Contracts;

namespace StudentEnrollment.Shared.Persistence.Seeds;

/// <summary>
/// Seeds a single super admin user into the Identity system.
/// </summary>
public sealed class SuAdminSeeder(
    ILogger<SuAdminSeeder> logger,
    IConfiguration configuration,
    UserManager<ApplicationUser> userManager,
    RoleManager<ApplicationRole> roleManager
) : ISeeder
{
    /// <summary>
    /// Ensures the SuAdmin role exists and creates a single super admin user if it doesn't exist.
    /// Safe to run multiple times.
    /// </summary>
    public async Task SeedAsync()
    {
        var suAdminEmail = configuration["SuAdmin:Email"];
        var suAdminPassword = configuration["SuAdmin:Password"];

        if (string.IsNullOrWhiteSpace(suAdminEmail))
            throw new InvalidOperationException("SuAdmin email is not configured.");

        if (string.IsNullOrWhiteSpace(suAdminPassword))
            throw new InvalidOperationException("SuAdmin password is not provided.");

        var suAdminRole = await roleManager.FindByNameAsync("SuAdmin");

        if (suAdminRole is null)
            throw new InvalidOperationException("SuAdmin role not found.");

        var user = await userManager.FindByEmailAsync(suAdminEmail);

        if (user is null)
        {
            user = new ApplicationUser { UserName = suAdminEmail, Email = suAdminEmail, EmailConfirmed = true };

            var createResult = await userManager.CreateAsync(user, suAdminPassword);
            if (!createResult.Succeeded)
            {
                var errors = createResult.Errors.Select(e => e.Description).ToArray();

                logger.LogError(
                    "Failed to create SuAdmin user {Email}: {Errors}",
                    suAdminEmail,
                    string.Join(", ", errors)
                );

                throw new InvalidOperationException(
                    "Failed to seed SuAdmin user.",
                    new AggregateException(errors.Select(e => new InvalidOperationException(e)))
                );
            }
        }

        if (!await userManager.IsInRoleAsync(user, suAdminRole.Name!))
        {
            var addToRoleResult = await userManager.AddToRoleAsync(user, suAdminRole.Name!);
            if (!addToRoleResult.Succeeded)
            {
                var errors = addToRoleResult.Errors.Select(e => e.Description).ToArray();

                logger.LogError(
                    "Failed to assign SuAdmin role to user {Email}: {Errors}",
                    suAdminEmail,
                    string.Join(", ", errors)
                );

                throw new InvalidOperationException(
                    "Failed to assign SuAdmin role.",
                    new AggregateException(errors.Select(e => new InvalidOperationException(e)))
                );
            }
        }
        
        logger.LogInformation("Seeding completed!");
    }
}