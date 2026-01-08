using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Courses.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.GetDetails;

public class GetCourseDetailsHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId)
    {
        var course = await context.Courses
            .AsNoTracking()
            .Select(CourseMapper.ProjectToDetails())
            .FirstOrDefaultAsync(c => c.Id == courseId);

        if (course is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found."));
        }

        return Results.Ok(course);
    }
}