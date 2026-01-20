namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public record StudentEnrollmentResponse(
    List<EnrolledCourseResponse> EnrolledCourses,
    int TotalCreditsAccumulated
);  