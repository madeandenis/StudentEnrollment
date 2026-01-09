using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Students.Common.Responses;

namespace StudentEnrollment.Features.Students.GetDetails;

public class GetStudentDetailsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/{studentId:int}", async (
                [FromRoute] int studentId,
                [FromServices] GetStudentDetailsHandler handler
            ) => await handler.HandleAsync(studentId))
            .WithName("GetStudentDetails")
            .RequireAuthorization("SameStudent")
            .Produces<StudentResponse>()
            .Produces(StatusCodes.Status404NotFound);
    }
}