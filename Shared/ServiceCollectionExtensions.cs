using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.ErrorHandling;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Persistence.Interceptors;
using StudentEnrollment.Shared.Persistence.Seeds;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers infrastructure services like HttpContextAccessor, ProblemDetails, exception handling, and validation.
    /// </summary>
    public static IServiceCollection RegisterInfrastructureServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddProblemDetails();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddValidation();
        return services;
    }
    
    /// <summary>
    /// Registers security-related services including ASP.NET Core Identity and CurrentUserService.
    /// Sets up user and role management, authentication, and token providers.
    /// </summary>
    public static IServiceCollection RegisterSecurityServices(this IServiceCollection services)
    {   
        services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
        services.AddScoped<CurrentUserService>();
        return services;
    }

    /// <summary>
    /// Registers persistence services including DbContext and EF Core interceptors.
    /// </summary>
    public static IServiceCollection RegisterPersistenceServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<AuditableEntityInterceptor>();
        services.AddScoped<SoftDeletableEntityInterceptor>();
        services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                .AddInterceptors(
                    serviceProvider.GetRequiredService<AuditableEntityInterceptor>(),
                    serviceProvider.GetRequiredService<SoftDeletableEntityInterceptor>()
                );
        });
        services.AddScoped<RoleSeeder>();
        services.AddScoped<SuAdminSeeder>();
        services.AddScoped<ApplicationDbContextInitializer>();

        return services;
    }
    
    /// <summary>
    /// Registers API services like OpenAPI
    /// </summary>
    public static IServiceCollection RegisterApiServices(this IServiceCollection services)
    {
        services.AddOpenApi();
        return services;
    }
}