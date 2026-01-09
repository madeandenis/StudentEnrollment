using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Students.Common;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.GetList;

public class GetStudentListHandler(
    GetStudentListValidator validator,
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(GetStudentListRequest request, PaginationRequest pagination)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());
        
        var students = await context.Students
            .AsNoTracking()
            .ApplySearchFilter(request)  
            .ApplySorting(request)  
            .Select(StudentMapper.ProjectToResponse())
            .ToPaginatedListAsync(pagination);

        return Results.Ok(students);
    }
}