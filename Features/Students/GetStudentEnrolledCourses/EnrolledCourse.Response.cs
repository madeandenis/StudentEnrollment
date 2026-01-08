namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public record EnrolledCourseResponse(
    string Code,
    string Name,
    int Credits,
    DateTime EnrollmentDate
);
