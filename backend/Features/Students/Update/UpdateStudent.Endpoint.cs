using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Students.Update;

public class UpdateStudentEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/{studentId}", async (
            [FromRoute] int studentId,
            [FromBody] UpdateStudentRequest request,
            [FromServices] UpdateStudentHandler handler
        ) => await handler.HandleAsync(studentId, request))
        .WithName("UpdateStudent")
        .RequireAuthorization("Admin")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status409Conflict);
    }
}