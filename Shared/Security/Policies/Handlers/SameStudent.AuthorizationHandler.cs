using Microsoft.AspNetCore.Authorization;
using StudentEnrollment.Shared.Security.Policies.Requirements;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared.Security.Policies.Handlers;

/// <summary>
/// Authorization handler that ensures the student ID present in the request route 
/// matches the student ID claim of the current authenticated user.
/// Note: Users with Admin or SuAdmin roles are automatically authorized.
/// </summary>
public class SameStudentAuthorizationHandler(IHttpContextAccessor httpContextAccessor) : AuthorizationHandler<SameStudentAuthorizationRequirement>
{
    private readonly CurrentUserService _currentUserService = new(httpContextAccessor);

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SameStudentAuthorizationRequirement requirement)
    {
        if (context.User.IsInRole("Admin") || context.User.IsInRole("SuAdmin"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        HttpContext? httpContext = httpContextAccessor.HttpContext;
        
        var claimId = _currentUserService.StudentId()?.ToString();

        if (claimId is null)
            return Task.CompletedTask;

        var routeId = httpContext?.GetRouteValue("studentId")?.ToString();

        if (routeId is null)
            return Task.CompletedTask;

        if (claimId == routeId)
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
}