using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

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
            .Produces<StudentDetailsResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }
}