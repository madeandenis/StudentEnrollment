using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Shared.Configuration;

public static class WebApplicationExtensions
{
    public static async Task InitializeDbAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var initializer = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitializer>();
        await initializer.InitializeAsync();
    }
}