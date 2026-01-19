using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.AssignGrade;

public class AssignGradeEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/{courseId:int}/assign/{studentId:int}/grade",
                async (
                    [FromRoute] int courseId,
                    [FromRoute] int studentId,
                    [FromBody] AssignGradeRequest request,
                    [FromServices] AssignGradeHandler handler
                ) => await handler.HandleAsync(courseId, studentId, request)
            )
            .WithName("AssignGrade")
            .RequireAuthorization("IsProfessor")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);

    }
}
