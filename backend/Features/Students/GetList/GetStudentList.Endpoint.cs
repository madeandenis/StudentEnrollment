using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Students.Common.Responses;

namespace StudentEnrollment.Features.Students.GetList;

public class GetStudentListEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/", async (
                [AsParameters] PaginationRequest pagination,
                [AsParameters] GetStudentListRequest request,
                [FromServices] GetStudentListHandler handler
            ) => await handler.HandleAsync(request, pagination))
            .WithName("GetStudentList")
            .RequireAuthorization("Admin")
            .Produces<PaginatedList<StudentResponse>>();
    }
}