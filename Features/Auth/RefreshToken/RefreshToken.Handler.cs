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
    RefreshTokenValidator validator,
    ApplicationDbContext context,
    ClaimsIdentityFactory identityFactory,
    TokenService tokenService
) : IHandler
{
    /// <summary>
    /// Handles the refresh token request asynchronously.
    /// Validates the refresh token, retrieves the associated user, and generates a new access token and refresh token pair.
    /// </summary>
    /// <param name="request">The refresh token request containing the refresh token.</param>
    /// <returns>
    /// An <see cref="IResult"/> containing:
    /// - 200 OK with new token pair if successful
    /// - 400 Bad Request if validation fails
    /// - 401 Unauthorized if the refresh token is invalid or expired
    /// - 404 Not Found if the user doesn't exist
    /// </returns>
    public async Task<IResult> HandleAsync(RefreshTokenRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        var refreshToken = await context.RefreshTokens.FirstOrDefaultAsync(rt =>
            rt.Token == request.RefreshToken
        );

        if (refreshToken is null || refreshToken.ExpiresAt < DateTime.UtcNow)
        {
            return Results.Unauthorized();
        }

        var user = await context.Users.FindAsync(refreshToken.UserId);
        if (user is null)
            return Results.NotFound(Problems.NotFound("The user does not exist."));

        var identity = await identityFactory.CreateAsync(user);
        var tokens = await tokenService.GenerateTokenPairAsync(user, identity, request.RefreshToken);

        return Results.Ok(new RefreshTokenResponse(
            tokens.AccessToken,
            tokens.RefreshToken,
            tokens.AccessTokenExpiresAt,
            tokens.RefreshTokenExpiresAt));
    }
}
