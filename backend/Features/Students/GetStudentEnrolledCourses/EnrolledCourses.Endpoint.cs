using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public class GetStudentEnrolledCoursesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/{studentIdentifier}/courses",
                async (
                    [FromRoute] string studentIdentifier,
                    [FromServices] EnrolledCoursesHandler handler
                ) => await handler.HandleAsync(studentIdentifier)
            )
            .WithName("GetStudentEnrolledCourses")
            .RequireAuthorization("SameStudent")
            .Produces<AcademicSituationResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }
}
