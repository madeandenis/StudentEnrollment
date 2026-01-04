using StudentEnrollment.Features.Courses.Common.Interfaces;

namespace StudentEnrollment.Features.Courses.Create;

public record CreateCourseRequest(
    string Name,
    string CourseCode,
    string Description,
    int Credits,
    int MaxEnrollment
) : ICourseRequest;
