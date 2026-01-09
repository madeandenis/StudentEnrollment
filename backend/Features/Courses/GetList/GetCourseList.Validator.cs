using FluentValidation;

namespace StudentEnrollment.Features.Courses.GetList;

public class GetCourseListValidator : AbstractValidator<GetCourseListRequest>
{
    public GetCourseListValidator()
    {
        RuleFor(x => x.SortOrder)
            .Must(x => x == null ||
                       x.Equals("asc", StringComparison.OrdinalIgnoreCase) ||
                       x.Equals("desc", StringComparison.OrdinalIgnoreCase))
            .WithMessage("SortOrder must be either 'asc' or 'desc'.");

        RuleFor(x => x.SortBy)
            .Must(x => x == null || _validColumns.Contains(x, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"Invalid sort column. Allowed: {string.Join(", ", _validColumns)}");

        RuleFor(x => x.Search).MaximumLength(150);
        RuleFor(x => x.Name).MaximumLength(150);
        RuleFor(x => x.Code).MaximumLength(20);

        RuleFor(x => x.MinCredits)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Minimum credits cannot be negative.");

        RuleFor(x => x.MaxCredits)
            .GreaterThanOrEqualTo(x => x.MinCredits ?? 0)
            .When(x => x.MinCredits.HasValue && x.MaxCredits.HasValue)
            .WithMessage("Maximum credits must be greater than or equal to minimum credits.");
    }

    private readonly string[] _validColumns =
    [
        "Name",
        "CourseCode",
        "Code",
        "Credits",
        "MaxEnrollment",
        "AvailableSeats",
        "CreatedAt"
    ];
}