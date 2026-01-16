using StudentEnrollment.Shared.Domain.Entities;

namespace tests.Courses;

/// <summary>
/// Test data builder used to create <see cref="Course"/> instances for unit and integration tests.
/// </summary>
public static class CourseBuilder
{
    /// <summary>
    /// Creates a valid <see cref="Course"/> with default values suitable for most test scenarios.
    /// </summary>
    public static Course Default(
        int id = 0,
        string name = "Default Course",
        string courseCode = "CS-DEFAULT",
        string description = "Default Course Description",
        int credits = 5,
        int maxEnrollment = 50
    )
    {
        return new Course
        {
            Id = id,
            Name = name,
            CourseCode = courseCode,
            Description = description,
            Credits = credits,
            MaxEnrollment = maxEnrollment,
        };
    }
}