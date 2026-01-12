using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared.Security.Configuration;

/// <summary>
/// Configures <see cref="JwtBearerOptions"/> for JWT authentication using settings from <see cref="JwtSettings"/>.
/// </summary>
public class ConfigureJwtBearerOptions(IOptions<JwtSettings> jwtSettings)
    : IConfigureNamedOptions<JwtBearerOptions>
{
    private readonly JwtSettings _jwtSettings = jwtSettings.Value;

    /// <summary>
    /// Configures default (unnamed) <see cref="JwtBearerOptions"/>.
    /// </summary>
    /// <param name="options">The JWT bearer options to configure.</param>
    public void Configure(JwtBearerOptions options)
    {
        Configure(string.Empty, options);
    }

    /// <summary>
    /// Configures named <see cref="JwtBearerOptions"/>.
    /// </summary>
    /// <param name="name">The name of the options instance.</param>
    /// <param name="options">The JWT bearer options to configure.</param>
    public void Configure(string? name, JwtBearerOptions options)
    {
        var secretKey = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateLifetime = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretKey),
            ValidIssuer = _jwtSettings.Authority,
            ValidAudience = _jwtSettings.Audience,
            ClockSkew = TimeSpan.Zero,
        };
        options.MapInboundClaims = false;
    }
}
