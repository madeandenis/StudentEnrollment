using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.AssignProfessor;

public class AssignProfessorEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/{courseId:int}/assign/{professorIdentifier}",
                async (
                    [FromRoute] int courseId,
                    [FromRoute] string professorIdentifier,
                    [FromServices] AssignProfessorHandler handler
                ) => await handler.HandleAsync(courseId, professorIdentifier)
            )
            .WithName("AssignProfessor")
            .RequireAuthorization("SameProfessor")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status409Conflict);
    }
}
