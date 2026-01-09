using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Common.Pagination;
using StudentEnrollment.Features.Courses.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.GetList;

public class GetCourseListHandler(
    GetCourseListValidator validator,
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(GetCourseListRequest request, PaginationRequest pagination)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());
        
        var courses = await context.Courses
            .AsNoTracking()
            .Select(CourseMapper.ProjectToResponse())
            .ToPaginatedListAsync(pagination);

        return Results.Ok(courses);
    }
}