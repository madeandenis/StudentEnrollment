using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.LogOut;

public class LogoutEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/logout",
                async (
                    HttpContext httpContext,
                    LogoutRequest? request,
                    [FromServices] LogoutHandler handler,
                    [FromServices] AuthCookieFactory cookieFactory
                ) =>
                {
                    var providedToken = httpContext.Request.Cookies["RefreshToken"];

                    if (string.IsNullOrWhiteSpace(providedToken))
                    {
                        return Results.Unauthorized();
                    }

                    var result = await handler.HandleAsync(providedToken, request);

                    httpContext.Response.Cookies.Delete(
                        "RefreshToken",
                        cookieFactory.CreateDeleteRefreshTokenOptions()
                    );
                    
                    return result;
                }
            )
            .WithName("Logout")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status401Unauthorized);
    }
}
