using System.Reflection;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Configuration;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.ErrorHandling;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Persistence.Interceptors;
using StudentEnrollment.Shared.Persistence.Seeders;
using StudentEnrollment.Shared.Security.Configuration;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared.Configuration;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        /// <summary>
        /// Registers infrastructure services like HttpContextAccessor, ProblemDetails, exception handling, and validation.
        /// </summary>
        public IServiceCollection RegisterInfrastructureServices()
        {
            services.AddHttpContextAccessor();
            services.AddProblemDetails();
            services.AddExceptionHandler<GlobalExceptionHandler>();
            services.AddValidation();
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddHandlers();
            return services;
        }
        
        /// <summary>
        /// Registers security-related services including ASP.NET Core Identity and CurrentUserService.
        /// Sets up user and role management, authentication, and token providers.
        /// </summary>
        public IServiceCollection RegisterSecurityServices(IConfiguration configuration)
        {   
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services.ConfigureIdentity();
            services.AddScoped<CurrentUserService>();
            services.AddJwtAuthentication(configuration);
            services.AddAuthorization();
            services.ConfigureAuthorizationPolicies();
            services.AddScoped<ClaimsIdentityFactory>();
            services.AddScoped<TokenService>();
            return services;
        }
        
        /// <summary>
        /// Registers persistence services including DbContext and EF Core interceptors.
        /// </summary>
        public IServiceCollection RegisterPersistenceServices(IConfiguration configuration)
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
        public IServiceCollection RegisterApiServices()
        {
            services.AddOpenApi();
            return services;
        }
    }
}