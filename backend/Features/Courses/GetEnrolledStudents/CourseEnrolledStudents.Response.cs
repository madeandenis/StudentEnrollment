namespace StudentEnrollment.Features.Courses.GetEnrolledStudents;

public record CourseEnrolledStudentsResponse(
    List<EnrolledStudentResponse> EnrolledStudents,
    int TotalEnrolledStudents
);
