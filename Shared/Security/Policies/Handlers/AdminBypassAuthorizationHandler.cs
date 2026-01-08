using Microsoft.AspNetCore.Authorization;

namespace StudentEnrollment.Shared.Security.Policies.Handlers;

/// <summary>
/// Global authorization handler that provides an administrative bypass for all requirements.
/// </summary>
public class AdminBypassAuthorizationHandler : IAuthorizationHandler
{
    public Task HandleAsync(AuthorizationHandlerContext context)
    {
        if (context.User.IsInRole("Admin") || context.User.IsInRole("SuAdmin"))
        {
            // Succeed all pending requirements for administrators
            foreach (var requirement in context.PendingRequirements.ToList())
            {
                context.Succeed(requirement);
            }
        }
        
        return Task.CompletedTask;
    }
}