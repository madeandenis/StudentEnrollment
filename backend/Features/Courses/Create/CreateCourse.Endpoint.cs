using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.Create;

public class CreateCourseEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/", async (
                [FromBody] CreateCourseRequest request,
                [FromServices] CreateCourseHandler handler
            ) => await handler.HandleAsync(request))
            .WithName("CreateCourse")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict);
    }
}