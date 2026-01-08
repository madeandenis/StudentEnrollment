using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Students.Create;

public class CreateStudentEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/", async (
                [FromBody] CreateStudentRequest request,
                [FromServices] CreateStudentHandler handler
            ) => await handler.HandleAsync(request))
            .WithName("CreateStudent")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict)
            .Produces(StatusCodes.Status404NotFound);
    }
}