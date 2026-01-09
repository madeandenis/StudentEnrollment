namespace StudentEnrollment.Features.Courses.Common.Responses;

public record CourseResponse
{
    public int Id { get; init; }
    public string CourseCode { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public int Credits { get; init; }
    public int MaxEnrollment { get; init; }
    public int EnrolledStudents { get; init; }
    public int AvailableSeats { get; init; }
    public bool HasAvailableSeats { get; init; }
    public DateTime CreatedAt { get; init; }
}