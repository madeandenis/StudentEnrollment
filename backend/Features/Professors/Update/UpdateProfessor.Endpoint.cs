using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Professors.Update;

public class UpdateProfessorEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(
                "/{professorId}",
                async (
                    [FromRoute] int professorId,
                    [FromBody] UpdateProfessorRequest request,
                    [FromServices] UpdateProfessorHandler handler
                ) => await handler.HandleAsync(professorId, request)
            )
            .WithName("UpdateProfessor")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status409Conflict);
    }
}
