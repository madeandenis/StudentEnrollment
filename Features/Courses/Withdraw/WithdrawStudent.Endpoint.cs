using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Courses.Withdraw;

public class WithdrawStudentEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/{courseId:int}/withdraw/{studentId:int}", async (
                [FromRoute] int courseId,
                [FromRoute] int studentId,
                [FromServices] WithdrawStudentHandler handler
            ) => await handler.HandleAsync(courseId, studentId))
            .WithName("WithdrawStudent")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }
}