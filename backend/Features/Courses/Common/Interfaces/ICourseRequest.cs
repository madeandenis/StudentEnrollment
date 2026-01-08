namespace StudentEnrollment.Features.Courses.Common.Interfaces;

/// <summary>
/// Defines the core contract for course data.
/// Ensures consistency across Create and Update operations.
/// </summary>
public interface ICourseRequest
{
    string CourseCode { get; }
    string Name { get; }
    string Description { get; }
    int Credits { get; }
    int MaxEnrollment { get; }
}