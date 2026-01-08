using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Features.Students.GetDetails;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.GetList;

public class GetStudentListHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(PaginationRequest pagination)
    {
        var students = await context.Students
            .AsNoTracking()
            .ToPaginatedListAsync(pagination);

        var response = students.Map(StudentMapper.ToStudentResponse<StudentDetailsResponse>);

        return Results.Ok(response);
    }
}