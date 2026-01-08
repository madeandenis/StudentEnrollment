using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Courses.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.GetList;

public class GetCourseListHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(PaginationRequest pagination)
    {
        var courses = await context.Courses
            .AsNoTracking()
            .Select(CourseMapper.ProjectToDetails())
            .ToPaginatedListAsync(pagination);

        return Results.Ok(courses);
    }
}