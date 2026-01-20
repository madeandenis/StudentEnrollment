using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Users.Common;
using StudentEnrollment.Features.Users.Common.Mappers;
using StudentEnrollment.Shared.Domain.Entities.Identity;

namespace StudentEnrollment.Features.Users.GetList;

public class GetUserListHandler(
    GetUserListValidator validator,
    UserManager<ApplicationUser> userManager
) : IHandler
{
    public async Task<IResult> HandleAsync(GetUserListRequest request, PaginationRequest pagination)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var users = await userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .AsNoTracking()
            .ApplySearchFilter(request)
            .ApplyRoleFilter(request)
            .ApplySorting(request)
            .Select(UserMapper.ProjectToResponse())
            .ToPaginatedListAsync(pagination);

        return Results.Ok(users);
    }
}
