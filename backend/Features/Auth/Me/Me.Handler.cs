using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Auth.Me;

public class MeHandler : IHandler
{
    /// <summary>
    /// Retrieves the current user's claims from the HTTP context.
    /// </summary>
    /// <param name="httpContext">The current HTTP context containing user claims.</param>
    /// <returns>A response containing the user's claims, or Unauthorized if the user is not authenticated.</returns>
    public Results<Ok<MeResponse>, UnauthorizedHttpResult> Handle(HttpContext httpContext)
    {
        var user = httpContext.User;

        if (user.Identity is not ClaimsIdentity { IsAuthenticated: true } identity)
            return TypedResults.Unauthorized();

        var claimsUser = ClaimsUser.FromClaimsIdentity(identity);

        return TypedResults.Ok(new MeResponse(claimsUser));
    }
}
