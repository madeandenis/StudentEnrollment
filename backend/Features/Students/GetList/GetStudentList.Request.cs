using StudentEnrollment.Features.Common.Pagination;

namespace StudentEnrollment.Features.Students.GetList;

public record GetStudentListRequest
{
    public string? SortBy { get; init; } = "CreatedAt";
    public string? SortOrder { get; init; } = "desc"; 
    
    public string? Search { get; init; }
    public string? Email { get; init; }
    
    public DateTime? RegisteredFrom { get; init; }
    public DateTime? RegisteredTo { get; init; }
}