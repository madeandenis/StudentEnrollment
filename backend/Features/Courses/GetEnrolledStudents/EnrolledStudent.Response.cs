namespace StudentEnrollment.Features.Courses.GetEnrolledStudents;

public record EnrolledStudentResponse(
    int StudentId,
    string StudentCode,
    string FullName,
    string Email,
    DateTime EnrollmentDate,
    decimal? Grade,
    string? AssignedByProfessor
);
