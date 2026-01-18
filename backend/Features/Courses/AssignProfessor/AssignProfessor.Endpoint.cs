using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.AssignProfessor;

public class AssignProfessorEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/{courseId:int}/assign/{professorId:int}",
                async (
                    [FromRoute] int courseId,
                    [FromRoute] int professorId,
                    [FromServices] AssignProfessorHandler handler
                ) => await handler.HandleAsync(courseId, professorId)
            )
            .WithName("AssignProfessor")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status409Conflict);
    }
}