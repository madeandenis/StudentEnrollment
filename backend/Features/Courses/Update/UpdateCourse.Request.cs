using StudentEnrollment.Features.Courses.Common.Interfaces;

namespace StudentEnrollment.Features.Courses.Update;

public record UpdateCourseRequest(
    string Name,
    string CourseCode,
    string Description,
    int Credits,
    int MaxEnrollment
) : ICourseRequest;
