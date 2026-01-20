namespace StudentEnrollment.Features.Professors.GetProfessorAssignedCourses;

public record AssignedCourseResponse(
    int CourseId,
    string Code,
    string Name,
    int Credits,
    int MaxEnrollment,
    int EnrolledStudents,
    int AvailableSeats,
    bool HasAvailableSeats,
    DateTime CreatedAt
);
