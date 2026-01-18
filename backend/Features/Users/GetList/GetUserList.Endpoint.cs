using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Users.Common.Responses;

namespace StudentEnrollment.Features.Users.GetList;

public class GetUserListEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/",
                async (
                    [AsParameters] PaginationRequest pagination,
                    [AsParameters] GetUserListRequest request,
                    [FromServices] GetUserListHandler handler
                ) => await handler.HandleAsync(request, pagination)
            )
            .WithName("GetUserList")
            .RequireAuthorization("Admin")
            .Produces<PaginatedList<UserResponse>>();
    }
}
