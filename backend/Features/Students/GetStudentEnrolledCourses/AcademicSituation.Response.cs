namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public record AcademicSituationResponse(
    List<EnrolledCourseResponse> EnrolledCourses,
    int TotalCreditsAccumulated
);