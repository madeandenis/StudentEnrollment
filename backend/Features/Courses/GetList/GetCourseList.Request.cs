namespace StudentEnrollment.Features.Courses.GetList;

public record GetCourseListRequest
{
    public string? SortBy { get; init; } = "CreatedAt";
    public string? SortOrder { get; init; } = "desc";

    public string? Search { get; init; }
    public string? Code { get; init; }
    public string? Name { get; init; }

    public bool? HasAssignedProfessor { get; init; }
    
    public int? MinCredits { get; init; }
    public int? MaxCredits { get; init; }
    public bool? HasAvailableSeats { get; init; }
};