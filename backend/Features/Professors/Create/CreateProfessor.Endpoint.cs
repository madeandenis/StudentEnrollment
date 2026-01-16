using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Professors.Create;

public class CreateProfessorEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/",
                async (
                    [FromBody] CreateProfessorRequest request,
                    [FromServices] CreateProfessorHandler handler
                ) => await handler.HandleAsync(request)
            )
            .WithName("CreateStudent")
            .RequireAuthorization("Admin")
            .Produces<CreateProfessorResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict)
            .Produces(StatusCodes.Status404NotFound);
    }
}