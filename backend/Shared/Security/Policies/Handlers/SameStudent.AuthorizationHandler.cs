using Microsoft.AspNetCore.Authorization;
using StudentEnrollment.Shared.Security.Policies.Requirements;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared.Security.Policies.Handlers;

/// <summary>
/// Authorization handler that ensures the student identifier (ID or code) present in the request route
/// matches either the student code or student ID of the current authenticated user.
/// Checks student code first and only queries the database for student ID if needed.
/// Supports both numeric student IDs and alphanumeric student codes.
/// </summary>
public class SameStudentAuthorizationHandler(
    IHttpContextAccessor httpContextAccessor,
    CurrentUserService currentUserService
) : AuthorizationHandler<SameStudentAuthorizationRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SameStudentAuthorizationRequirement requirement
    )
    {
        HttpContext? httpContext = httpContextAccessor.HttpContext;

        // Get the student identifier from the route (can be ID or student code)
        var routeIdentifier = httpContext?.GetRouteValue("studentIdentifier")?.ToString();

        if (routeIdentifier is null)
            return;

        // First, check student code from claims
        var userStudentCode = currentUserService.StudentCode();
        if (userStudentCode != null && routeIdentifier == userStudentCode)
        {
            context.Succeed(requirement);
            return;
        }

        // As a fallback, check student ID from database
        var userStudentId = await currentUserService.StudentIdAsync();
        if (userStudentId != null && routeIdentifier == userStudentId.ToString())
        {
            context.Succeed(requirement);
        }
    }
}
