using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;

namespace StudentEnrollment.Features.Courses.GetList;

public class GetCourseListEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/", async (
                [AsParameters] PaginationRequest pagination,
                [FromServices] GetCourseListHandler handler
            ) => await handler.HandleAsync(pagination))
            .WithName("GetCourseList")
            .RequireAuthorization("Admin") 
            .Produces(StatusCodes.Status200OK);
    }
}