using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Students.Common.Responses;

namespace StudentEnrollment.Features.Students.GetDetails;

public class GetStudentDetailsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/{studentIdentifier}",
                async (
                    [FromRoute] string studentIdentifier,
                    [FromServices] GetStudentDetailsHandler handler
                ) => await handler.HandleAsync(studentIdentifier)
            )
            .WithName("GetStudentDetails")
            .RequireAuthorization("SameStudent")
            .Produces<StudentResponse>()
            .Produces(StatusCodes.Status404NotFound);
    }
}
