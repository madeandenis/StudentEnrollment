using Microsoft.AspNetCore.Authorization;
using StudentEnrollment.Shared.Security.Policies.Requirements;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared.Security.Policies.Handlers;

/// <summary>
/// Authorization handler that ensures the professor identifier (ID or code) present in the request route
/// matches the professor code of the current authenticated user.
/// Supports both numeric professor IDs and alphanumeric professor codes.
/// </summary>
public class SameProfessorAuthorizationHandler(
    IHttpContextAccessor httpContextAccessor,
    ICurrentUserService currentUserService
) : AuthorizationHandler<SameProfessorAuthorizationRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SameProfessorAuthorizationRequirement requirement
    )
    {
        HttpContext? httpContext = httpContextAccessor.HttpContext;

        var routeIdentifier = httpContext?.GetRouteValue("professorIdentifier")?.ToString();

        if (routeIdentifier is null)
            return;

        // First, check professor code from claims
        var userProfessorCode = currentUserService.ProfessorCode();
        if (userProfessorCode != null && routeIdentifier == userProfessorCode)
        {
            context.Succeed(requirement);
            return;
        }

        // As a fallback, check professor ID from database
        var userProfessorId = await currentUserService.ProfessorIdAsync();
        if (userProfessorId != null && routeIdentifier == userProfessorId.ToString())
        {
            context.Succeed(requirement);
        }
    }
}
