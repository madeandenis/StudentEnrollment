using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Auth.Me;

public class MeEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/me",
                (HttpContext httpContext, [FromServices] MeHandler handler) =>
                {
                    return handler.Handle(httpContext);
                }
            )
            .WithName("GetMe")
            .RequireAuthorization()
            .Produces<MeResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);
    }
}
