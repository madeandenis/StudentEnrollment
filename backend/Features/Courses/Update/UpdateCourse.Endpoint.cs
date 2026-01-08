using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.Update;

public class UpdateCourseEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/{courseId}", async (
                [FromRoute] int courseId,
                [FromBody] UpdateCourseRequest request,
                [FromServices] UpdateCourseHandler handler
            ) => await handler.HandleAsync(courseId, request))
            .WithName("UpdateCourse")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest) 
            .Produces(StatusCodes.Status404NotFound) 
            .Produces(StatusCodes.Status409Conflict); 
    }
}