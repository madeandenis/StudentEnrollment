using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Professors.Common.Responses;

namespace StudentEnrollment.Features.Professors.GetList;

public class GetProfessorListEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/",
                async (
                    [AsParameters] PaginationRequest pagination,
                    [AsParameters] GetProfessorListRequest request,
                    [FromServices] GetProfessorListHandler handler
                ) => await handler.HandleAsync(request, pagination)
            )
            .WithName("GetProfessorList")
            .RequireAuthorization("Admin")
            .Produces<PaginatedList<ProfessorResponse>>();
    }
}
