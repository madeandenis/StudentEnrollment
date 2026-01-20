namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public record EnrolledCourseResponse(
    int CourseId,
    string Code,
    string Name,
    int Credits,
    DateTime EnrollmentDate,
    decimal? Grade,
    string? AssignedByProfessor
);
