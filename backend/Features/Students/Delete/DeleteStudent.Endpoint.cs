using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Students.Delete;

public class DeleteStudentEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/{studentId}", async (
            [FromRoute] int studentId,
            [FromServices] DeleteStudentHandler handler
        ) => await handler.HandleAsync(studentId))
        .WithName("DeleteStudent")
        .RequireAuthorization("Admin")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}