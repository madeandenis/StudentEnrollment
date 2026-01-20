namespace StudentEnrollment.Features.Professors.GetProfessorAssignedCourses;

public record ProfessorAssignmentResponse(
    List<AssignedCourseResponse> AssignedCourses,
    int TotalCourses,
    int TotalStudents
);
