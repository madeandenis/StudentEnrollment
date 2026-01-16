using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Professors.Common;
using StudentEnrollment.Features.Professors.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Professors.GetList;

public class GetProfessorListHandler(
    GetProfessorListValidator validator,
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(
        GetProfessorListRequest request,
        PaginationRequest pagination
    )
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var professors = await context
            .Professors.AsNoTracking()
            .ApplySearchFilter(request)
            .ApplySorting(request)
            .Select(ProfessorMapper.ProjectToResponse())
            .ToPaginatedListAsync(pagination);

        return Results.Ok(professors);
    }
}
