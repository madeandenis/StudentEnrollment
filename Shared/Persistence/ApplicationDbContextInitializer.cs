using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Shared.Persistence.Seeders;

namespace StudentEnrollment.Shared.Persistence;

public class ApplicationDbContextInitializer(
    ApplicationDbContext context,
    RoleSeeder roleSeeder,
    SuAdminSeeder suAdminSeeder
)
{
    public async Task InitializeAsync()
    {
        await context.Database.MigrateAsync();
        await roleSeeder.SeedAsync();
        await suAdminSeeder.SeedAsync();
    }
}