using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Shared.Configuration;

public static class WebApplicationExtensions
{
    extension(WebApplication app)
    {
        /// <summary>
        /// Initializes the database by running migrations and seeding initial data.
        /// This method should only be called in development environments.
        /// </summary>
        public async Task InitializeDbAsync()
        {
            using var scope = app.Services.CreateScope();
            var initializer =
                scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitializer>();
            await initializer.InitializeAsync();
        }
    }
}
