using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.Enroll;

public class EnrollStudentEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/{courseId:int}/enroll/{studentId:int}", async (
                [FromRoute] int courseId,
                [FromRoute] int studentId,
                [FromServices] EnrollStudentHandler handler
            ) => await handler.HandleAsync(courseId, studentId))
            .WithName("EnrollStudent")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status409Conflict);
    }
}