using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Professors.Delete;

public class DeleteProfessorEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(
                "/{professorId}",
                async (
                    [FromRoute] int professorId,
                    [FromServices] DeleteProfessorHandler handler
                ) => await handler.HandleAsync(professorId)
            )
            .WithName("DeleteProfessor")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }
}
