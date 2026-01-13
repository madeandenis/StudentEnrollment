using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Students.Common.Responses;

namespace StudentEnrollment.Features.Students.Create;

public class CreateStudentEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/",
                async (
                    [FromBody] CreateStudentRequest request,
                    [FromServices] CreateStudentHandler handler
                ) => await handler.HandleAsync(request)
            )
            .WithName("CreateStudent")
            .RequireAuthorization("Admin")
            .Produces<CreateStudentResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict)
            .Produces(StatusCodes.Status404NotFound);
    }
}
