using System.Reflection;
using System.Threading.RateLimiting;
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
        public IServiceCollection RegisterInfrastructureServices(IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddProblemDetails();
            services.AddExceptionHandler<GlobalExceptionHandler>();
            services.RegisterCors(configuration);
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
            services
                .AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services.ConfigureIdentity();
            services.AddScoped<CurrentUserService>();
            services.AddJwtAuthentication(configuration);
            services.AddAuthorization();
            services.ConfigureAuthorizationPolicies();
            services.AddScoped<ClaimsIdentityFactory>();
            services.AddScoped<TokenService>();
            services.AddScoped<AuthCookieFactory>();
            services.RegisterRateLimiting();

            return services;
        }

        /// <summary>
        /// Registers persistence services including DbContext and EF Core interceptors.
        /// </summary>
        public IServiceCollection RegisterPersistenceServices(IConfiguration configuration)
        {
            services.AddScoped<AuditableEntityInterceptor>();
            services.AddScoped<SoftDeletableEntityInterceptor>();
            services.AddDbContext<ApplicationDbContext>(
                (serviceProvider, options) =>
                {
                    options
                        .UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                        .AddInterceptors(
                            serviceProvider.GetRequiredService<AuditableEntityInterceptor>(),
                            serviceProvider.GetRequiredService<SoftDeletableEntityInterceptor>()
                        );
                }
            );
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

        /// <summary>
        /// Configures and adds Cross-Origin Resource Sharing (CORS) based on
        /// the "AllowedOrigins" section in appsettings.
        /// </summary>
        private IServiceCollection RegisterCors(IConfiguration configuration)
        {
            var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];

            return services.AddCors(options =>
            {
                options.AddPolicy(
                    "CorsPolicy",
                    policy =>
                    {
                        policy
                            .WithOrigins(allowedOrigins)
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                    }
                );
            });
        }

        /// <summary>
        /// Registers rate limiting services to protect API endpoints from abuse and excessive requests.
        /// </summary>
        /// <remarks>
        /// Configures three rate limiting policies:
        /// <list type="bullet">
        ///   <item><term>Auth Policy</term><description>Strict limit for login/register endpoints (5 requests/minute per IP)</description></item>
        ///   <item><term>RefreshToken Policy</term><description>Moderate limit for token refresh endpoints (20 requests/minute per user/IP)</description></item>
        ///   <item><term>Global Limiter</term><description>General limit for all other endpoints (100 requests/minute per user/IP)</description></item>
        /// </list>
        /// </remarks>
        public IServiceCollection RegisterRateLimiting()
        {
            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                options.AddPolicy(
                    "Auth",
                    context =>
                        RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey: context.Connection.RemoteIpAddress?.ToString()
                                ?? Guid.NewGuid().ToString(),
                            factory: partition => new FixedWindowRateLimiterOptions
                            {
                                AutoReplenishment = true,
                                PermitLimit = 5,
                                QueueLimit = 0,
                                Window = TimeSpan.FromMinutes(1),
                            }
                        )
                );

                options.AddPolicy(
                    "RefreshToken",
                    context =>
                        RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey: context.User.Identity?.Name
                                ?? context.Connection.RemoteIpAddress?.ToString()
                                ?? Guid.NewGuid().ToString(),
                            factory: _ => new FixedWindowRateLimiterOptions
                            {
                                AutoReplenishment = true,
                                PermitLimit = 20,
                                QueueLimit = 0,
                                Window = TimeSpan.FromMinutes(1),
                            }
                        )
                );

                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(
                    context =>
                    {
                        return RateLimitPartition.GetFixedWindowLimiter(
                            partitionKey: context.User.Identity?.Name
                                ?? context.Connection.RemoteIpAddress?.ToString()
                                ?? Guid.NewGuid().ToString(),
                            factory: _ => new FixedWindowRateLimiterOptions
                            {
                                AutoReplenishment = true,
                                PermitLimit = 100,
                                QueueLimit = 0,
                                Window = TimeSpan.FromMinutes(1),
                            }
                        );
                    }
                );
            });

            return services;
        }
    }
}
