using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.Delete;

public class DeleteCourseEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/{courseId}", async (
                [FromRoute] int courseId,
                [FromServices] DeleteCourseHandler handler
            ) => await handler.HandleAsync(courseId))
            .WithName("DeleteCourse")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }
}