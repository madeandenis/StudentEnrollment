using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public class GetStudentEnrolledCoursesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/{studentId:int}/courses", async (
                [FromRoute] int studentId,
                [FromServices] EnrolledCoursesHandler handler
            ) => await handler.HandleAsync(studentId))
            .WithName("GetStudentEnrolledCourses")
            .RequireAuthorization("Admin")
            .Produces<AcademicSituationResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }
}