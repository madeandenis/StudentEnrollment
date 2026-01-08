using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Shared.Persistence.Seeders;

namespace StudentEnrollment.Shared.Persistence;

public class ApplicationDbContextInitializer(
    ApplicationDbContext context,
    RoleSeeder roleSeeder,
    SuAdminSeeder suAdminSeeder
)
{
    /// <summary>
    /// Initializes the database asynchronously by applying pending migrations and seeding roles and super admin user.
    /// </summary>
    public async Task InitializeAsync()
    {
        await context.Database.MigrateAsync();
        await roleSeeder.SeedAsync();
        await suAdminSeeder.SeedAsync();
    }
}
