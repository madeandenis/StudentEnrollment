using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Courses.Common.Responses;

namespace StudentEnrollment.Features.Courses.GetDetails;

public class GetCourseDetailsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/{courseId:int}", async (
                [FromRoute] int courseId,
                [FromServices] GetCourseDetailsHandler handler
            ) => await handler.HandleAsync(courseId))
            .WithName("GetCourseDetails")
            .RequireAuthorization("IsStudent") 
            .Produces<CourseResponse>()
            .Produces(StatusCodes.Status404NotFound);
    }
}