using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.GetEnrolledStudents;

public class GetEnrolledStudentsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/{courseIdentifier}/students",
                async (
                    [FromRoute] string courseIdentifier,
                    [FromServices] GetEnrolledStudentsHandler handler
                ) => await handler.HandleAsync(courseIdentifier)
            )
            .WithName("GetCourseEnrolledStudents")
            .RequireAuthorization("IsProfessor")
            .Produces<CourseEnrolledStudentsResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);
    }
}
