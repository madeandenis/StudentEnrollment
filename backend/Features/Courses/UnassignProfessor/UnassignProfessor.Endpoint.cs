using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.UnassignProfessor;

public class UnassignProfessorEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(
                "/{courseId:int}/unassign/{professorIdentifier}",
                async (
                    [FromRoute] int courseId,
                    [FromRoute] string professorIdentifier,
                    [FromServices] UnassignProfessorHandler handler
                ) => await handler.HandleAsync(courseId, professorIdentifier)
            )
            .WithName("UnassignProfessor")
            .RequireAuthorization("SameProfessor")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status409Conflict);
    }
}
