using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.LogOut;

/// <summary>
/// Handles user logout requests by invalidating refresh tokens.
/// Supports logging out from the current device or all devices.
/// </summary>
public class LogoutHandler(
    LogoutValidator validator,
    CurrentUserService currentUserService,
    ApplicationDbContext context
)
    : IHandler
{
    /// <summary>
    /// Handles the logout request asynchronously.
    /// Deletes refresh tokens for the current user, either for the current device only or all devices.
    /// </summary>
    /// <param name="request">The logout request specifying whether to log out from all devices.</param>
    /// <returns>An <see cref="IResult"/> with 200 OK status upon successful logout.</returns>
    public async Task<IResult> HandleAsync(LogoutRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }
        
        var userId = currentUserService.RequiredUserId();

        var query = context.RefreshTokens.Where(rt => rt.UserId == userId);

        if (request.AllDevices is false)
            query = query.Where(rt => rt.Token == request.RefreshToken);

        await query.ExecuteDeleteAsync();

        return Results.Ok();
    }
}
