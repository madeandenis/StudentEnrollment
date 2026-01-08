using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;

namespace StudentEnrollment.Features.Students.GetList;

public class GetStudentListEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/", async (
                [AsParameters] PaginationRequest pagination,
                [FromServices] GetStudentListHandler handler
            ) => await handler.HandleAsync(pagination))
            .WithName("GetStudentList")
            .RequireAuthorization("Admin")
            .Produces(StatusCodes.Status200OK);
    }
}