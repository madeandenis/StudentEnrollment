namespace StudentEnrollment.Features.Users.GetList;

public record GetUserListRequest
{
    public string? SortBy { get; init; } = "Id";
    public string? SortOrder { get; init; } = "desc";

    public string? Search { get; init; }

    public bool? IsAdmin { get; init; }

    public bool? ExcludeWithProfessor { get; init; }
}
