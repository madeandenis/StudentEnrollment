using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.UnassignProfessor;

public class UnassignProfessorEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(
                "/{courseId:int}/unassign/{professorId:int}",
                async (
                    [FromRoute] int courseId,
                    [FromRoute] int professorId,
                    [FromServices] UnassignProfessorHandler handler
                ) => await handler.HandleAsync(courseId, professorId)
            )
            .WithName("UnassignProfessor")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status409Conflict);
    }
}
