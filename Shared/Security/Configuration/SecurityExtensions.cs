using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace StudentEnrollment.Shared.Security.Configuration;

public static class SecurityExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication()
            .AddJwtBearer("JwtBearer", jwtOptions =>
            {
                // jwtOptions.MetadataAddress = configuration["Api:MetadataAddress"];
                jwtOptions.Authority = configuration["Api:Authority"];
                jwtOptions.Audience = configuration["Api:Audience"];
                jwtOptions.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    // ValidAudiences = configuration.GetSection("Api:ValidAudiences").Get<string[]>(),
                    // ValidIssuers = configuration.GetSection("Api:ValidIssuers").Get<string[]>()
                };

                jwtOptions.MapInboundClaims = false;
            });
        
        return services;
    }

    public static IServiceCollection AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("SuAdmin", policy => policy.RequireRole("SuAdmin"));
            options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
            
            options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        });
        
        return services;
    }

    public static IServiceCollection ConfigureIdentity(this IServiceCollection services)
    {
        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;

            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
            options.Lockout.MaxFailedAccessAttempts = 5;

            options.SignIn.RequireConfirmedEmail = true;
            options.User.RequireUniqueEmail = true;
        });
        return services;
    }
}