using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Courses.Common.Responses;

namespace StudentEnrollment.Features.Courses.GetList;

public class GetCourseListEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/",
                async (
                    [AsParameters] PaginationRequest pagination,
                    [AsParameters] GetCourseListRequest request,
                    [FromServices] GetCourseListHandler handler
                ) => await handler.HandleAsync(request, pagination)
            )
            .WithName("GetCourseList")
            .RequireAuthorization("Admin")
            .Produces<PaginatedList<CourseResponse>>();
    }
}
