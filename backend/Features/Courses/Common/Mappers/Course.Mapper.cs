using System.Linq.Expressions;
using StudentEnrollment.Features.Courses.Common.Interfaces;
using StudentEnrollment.Features.Courses.Common.Responses;
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
    /// directly into a <see cref="CourseResponse"/> at the database level.
    /// </summary>
    public static Expression<Func<Course, CourseResponse>> ProjectToResponse() =>
        course => new CourseResponse
        {
            Id = course.Id,
            CourseCode = course.CourseCode,
            Name = course.Name,
            Description = course.Description,
            Credits = course.Credits,
            MaxEnrollment = course.MaxEnrollment,
            EnrolledStudents = course.Enrollments.Count,
            AvailableSeats = course.MaxEnrollment - course.Enrollments.Count,
            HasAvailableSeats = course.MaxEnrollment > course.Enrollments.Count,
            CreatedAt = course.CreatedAt,
        };

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

    public static CourseResponse ToResponse(Course course) =>
        new CourseResponse
        {
            Id = course.Id,
            CourseCode = course.CourseCode,
            Name = course.Name,
            Description = course.Description,
            Credits = course.Credits,
            MaxEnrollment = course.MaxEnrollment,
            EnrolledStudents = course.Enrollments?.Count ?? 0,
            AvailableSeats = course.MaxEnrollment - (course.Enrollments?.Count ?? 0),
            HasAvailableSeats = course.MaxEnrollment > (course.Enrollments?.Count ?? 0),
            CreatedAt = course.CreatedAt,
        };
}
