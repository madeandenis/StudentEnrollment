namespace StudentEnrollment.Features.Courses.GetDetails;

public record CourseDetailsResponse(
    int Id,
    string CourseCode,
    string Name,
    int Credits,
    int MaxEnrollment,
    int CurrentEnrollmentCount
);