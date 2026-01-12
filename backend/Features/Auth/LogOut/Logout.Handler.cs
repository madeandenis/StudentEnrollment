using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.LogOut;

/// <summary>
/// Handles user logout requests by invalidating refresh tokens.
/// Supports logging out from the current device or all devices.
/// </summary>
public class LogoutHandler(CurrentUserService currentUserService, ApplicationDbContext context)
    : IHandler
{
    /// <summary>
    /// Handles user logout by invalidating refresh tokens.
    /// </summary>
    /// <param name="providedToken">The refresh token string from the secure cookie.</param>
    /// <param name="request">Specifies if logout applies to the current session or all devices.</param>
    /// <returns>
    /// <list type="bullet">
    /// <item><description>200 OK: Session successfully terminated.</description></item>
    /// <item><description>401 Unauthorized: Invalid user context.</description></item>
    /// </list>
    /// </returns>
    public async Task<IResult> HandleAsync(string providedToken, LogoutRequest? request)
    {
        var userId = currentUserService.RequiredUserId();

        var query = context.RefreshTokens.Where(rt => rt.UserId == userId);

        if (request?.AllDevices == false)
            query = query.Where(rt => rt.Token == providedToken);

        await query.ExecuteDeleteAsync();

        return Results.Ok();
    }
}
