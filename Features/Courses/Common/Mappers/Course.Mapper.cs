using System.Linq.Expressions;
using StudentEnrollment.Features.Courses.Common.Interfaces;
using StudentEnrollment.Features.Courses.Create;
using StudentEnrollment.Features.Courses.GetDetails;
using StudentEnrollment.Shared.Domain.Entities;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Courses.Common.Mappers;

/// <summary>
/// Provides mapping logic to transform between Course entities, requests, and response DTOs.
/// </summary>
public class CourseMapper
{
    /// <summary>
    /// Provides a projection expression for converting a <see cref="Course"/> entity 
    /// directly into a <see cref="CourseDetailsResponse"/> at the database level.
    /// </summary>
    public static Expression<Func<Course, CourseDetailsResponse>> ProjectToDetails() 
        => course => new CourseDetailsResponse(
            course.Id,
            course.CourseCode,
            course.Name,
            course.Credits,
            course.MaxEnrollment,
            course.Enrollments.Count()
        );

    /// <summary>
    /// Creates a new <see cref="Course"/> entity from a <see cref="CreateCourseRequest"/>,
    /// applying normalization to identifiers and text fields.
    /// </summary>
    /// <param name="request">The course creation request data.</param>
    /// <returns>A new <see cref="Course"/> entity.</returns>
    public static Course ToEntity(CreateCourseRequest request)
    {
        return new Course()
        {
            CourseCode = NormalizeToUpper(request.CourseCode),
            Name = Normalize(request.Name),
            Description = Normalize(request.Description),
            Credits = request.Credits,
            MaxEnrollment = request.MaxEnrollment,
        };
    }

    /// <summary>
    /// Updates an existing <see cref="Course"/> entity with values from an <see cref="ICourseRequest"/>.
    /// </summary>
    /// <param name="course">The tracked entity to update.</param>
    /// <param name="request">The source request containing updated data.</param>
    public static void ApplyRequest(Course course, ICourseRequest request)
    {
        course.CourseCode = NormalizeToUpper(request.CourseCode);
        course.Name = Normalize(request.Name);
        course.Description = Normalize(request.Description);
        course.Credits = request.Credits;
        course.MaxEnrollment = request.MaxEnrollment;
    }
}