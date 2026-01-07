using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Configuration;

namespace StudentEnrollment.Shared.Security.Services;

/// <summary>
/// Provides services for generating and managing JWT access tokens and refresh tokens.
/// Implements token rotation and automatic cleanup of expired tokens.
/// </summary>
public class TokenService(IOptions<JwtSettings> jwtSettings, ApplicationDbContext dbContext)
{
    private readonly JwtSettings _jwtSettings = jwtSettings.Value;

    /// <summary>
    /// Generates a new access token and refresh token pair for the specified user.
    /// Optionally rotates an existing refresh token by invalidating it and creating a new one.
    /// </summary>
    /// <param name="user">The user for whom tokens are generated.</param>
    /// <param name="claimsIdentity">Claims for the access token.</param>
    /// <param name="oldRefreshToken">Optional old refresh token to rotate.</param>
    /// <returns>
    /// Tuple containing:
    /// - AccessToken
    /// - RefreshToken
    /// - AccessTokenExpiresAt
    /// - RefreshTokenExpiresAt
    /// </returns>
    public async Task<(
        string AccessToken,
        string RefreshToken,
        DateTime AccessTokenExpiresAt,
        DateTime RefreshTokenExpiresAt
    )> GenerateTokenPairAsync(
        ApplicationUser user,
        ClaimsIdentity claimsIdentity,
        string? oldRefreshToken = null
    )
    {
        var refreshToken = await RotateRefreshTokenAsync(user, oldRefreshToken);
        var accessToken = GenerateAccessToken(claimsIdentity.Claims, GetSigningCredentials());

        return (
            accessToken,
            refreshToken.Token,
            DateTime.UtcNow.AddMinutes(_jwtSettings.TokenExpirationInMinutes),
            refreshToken.ExpiresAt
        );
    }

    // Rotates a refresh token by creating a new one and removing the old token and any expired tokens.
    private async Task<RefreshToken> RotateRefreshTokenAsync(
        ApplicationUser user,
        string? oldRefreshToken = null
    )
    {
        var tokensToDelete = await dbContext
            .RefreshTokens.Where(rt =>
                rt.UserId == user.Id
                && (rt.Token == oldRefreshToken || rt.ExpiresAt <= DateTime.UtcNow)
            )
            .ToListAsync();

        if (tokensToDelete.Any())
        {
            dbContext.RefreshTokens.RemoveRange(tokensToDelete);
        }

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = GenerateRandomToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationInDays),
        };

        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync();

        return refreshToken;
    }

    // Generates a JWT access token with the specified claims.
    private string GenerateAccessToken(
        IEnumerable<Claim> claims,
        SigningCredentials signingCredentials
    )
    {
        var token = new JwtSecurityToken(
            issuer: jwtSettings.Value.Authority,
            audience: jwtSettings.Value.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.TokenExpirationInMinutes),
            signingCredentials: signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private SigningCredentials GetSigningCredentials()
    {
        var secretKey = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);
        return new SigningCredentials(
            new SymmetricSecurityKey(secretKey),
            SecurityAlgorithms.HmacSha256
        );
    }

    private string GenerateRandomToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }
}
