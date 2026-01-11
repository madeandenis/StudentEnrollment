using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using StudentEnrollment.Shared.Security.Common;
using StudentEnrollment.Shared.Security.Policies.Handlers;
using StudentEnrollment.Shared.Security.Policies.Requirements;

namespace StudentEnrollment.Shared.Security.Configuration;

public static class SecurityExtensions
{
    extension(IServiceCollection services)
    {
        /// <summary>
        /// Adds and configures JWT authentication using settings from configuration.
        /// </summary>
        public IServiceCollection AddJwtAuthentication(IConfiguration configuration)
        {
            services.AddOptions<JwtSettings>()
                .Bind(configuration.GetSection("JwtSettings"))
                .ValidateDataAnnotations()
                .ValidateOnStart();

            // Register custom JWT bearer options configuration
            services.AddSingleton<IConfigureOptions<JwtBearerOptions>, ConfigureJwtBearerOptions>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme);

            return services;
        }

        /// <summary>
        /// Configures authorization policies for the application.
        /// </summary>
        public IServiceCollection ConfigureAuthorizationPolicies()
        {
            // Register custom authorization handlers
            services.AddScoped<IAuthorizationHandler, AdminBypassAuthorizationHandler>();
            services.AddScoped<IAuthorizationHandler, SameStudentAuthorizationHandler>();
            
            services.Configure<AuthorizationOptions>(options =>
            {
                // Define role-based policies
                options.AddPolicy("SuAdmin", policy => policy.RequireRole("SuAdmin"));
                options.AddPolicy("Admin", policy => { policy.RequireRole("Admin", "SuAdmin"); });

                // Define context-based policies
                options.AddPolicy("SameStudent", policy =>
                    policy.AddRequirements(new SameStudentAuthorizationRequirement()));
                
                options.AddPolicy("IsStudent", policy => policy.RequireClaim(ApplicationUserClaims.StudentCode));

                // Fallback policy: require authentication by default
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
            });

            return services;
        }

        /// <summary>
        /// Configures ASP.NET Identity options such as password rules, lockout, and user settings.
            /// </summary>
            public IServiceCollection ConfigureIdentity()
            {
                services.Configure<IdentityOptions>(options =>
                {
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 8;
                    options.Password.RequireNonAlphanumeric = true;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequiredUniqueChars = 4;

                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                    options.Lockout.MaxFailedAccessAttempts = 10;

                    options.SignIn.RequireConfirmedEmail = false;
                    options.User.RequireUniqueEmail = true;
                });
                return services;
            }
    }
}