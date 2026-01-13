using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Courses.Common.Mappers;
using StudentEnrollment.Shared.Persistence;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Courses.Create;

/// <summary>
/// Handles the creation of a new course record.
/// Performs validation, checks for existing CourseCode duplicates, and maps the request to a persisted entity.
/// </summary>
public class CreateCourseHandler(CreateCourseValidator validator, ApplicationDbContext context)
    : IHandler
{
    public async Task<IResult> HandleAsync(CreateCourseRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var normalizedCode = NormalizeToUpper(request.CourseCode);

        var isCodeTaken = await context
            .Courses.AsNoTracking()
            .AnyAsync(c => c.CourseCode == normalizedCode);

        if (isCodeTaken)
        {
            return Results.Conflict(
                Problems.Conflict("Another course with the same code already exists.")
            );
        }

        var course = CourseMapper.ToEntity(request);

        context.Courses.Add(course);
        await context.SaveChangesAsync();

        return Results.Created($"/courses/{course.Id}", CourseMapper.ToResponse(course));
    }
}
