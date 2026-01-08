using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.RefreshToken;

/// <summary>
/// Handles refresh token requests by validating the refresh token and generating a new token pair.
/// Implements token rotation for enhanced security.
/// </summary>
public class RefreshTokenHandler(
    ApplicationDbContext context,
    ClaimsIdentityFactory identityFactory,
    TokenService tokenService
) : IHandler
{
    /// <summary>
    /// Handles the refresh token request asynchronously.
    /// </summary>
    /// <returns>
    /// An <see cref="IResult"/> containing:
    /// - 200 OK with new token pair if successful
    /// - 401 Unauthorized if the refresh token is invalid or expired
    /// - 404 Not Found if the user doesn't exist
    /// </returns>
    public async Task<IResult> HandleAsync(string providedToken)
    {
        var storedToken = await context.RefreshTokens.FirstOrDefaultAsync(rt =>
            rt.Token == providedToken
        );

        if (storedToken is null || storedToken.ExpiresAt < DateTime.UtcNow)
        {
            return Results.Unauthorized();
        }

        var user = await context.Users.FindAsync(storedToken.UserId);
        if (user is null)
            return Results.NotFound(Problems.NotFound("The user does not exist."));

        var identity = await identityFactory.CreateAsync(user);
        var tokens = await tokenService.GenerateTokenPairAsync(user, identity, providedToken);

        return Results.Ok(new RefreshTokenResponse(
            tokens.AccessToken,
            tokens.RefreshToken,
            tokens.AccessTokenExpiresAt,
            tokens.RefreshTokenExpiresAt));
    }
}
