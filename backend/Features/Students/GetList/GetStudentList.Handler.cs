using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.GetList;

public class GetStudentListHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(PaginationRequest pagination)
    {
        var students = await context.Students
            .AsNoTracking()
            .Select(StudentMapper.ProjectToDetails())
            .ToPaginatedListAsync(pagination);

        return Results.Ok(students);
    }
}