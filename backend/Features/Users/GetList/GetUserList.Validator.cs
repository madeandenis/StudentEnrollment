using FluentValidation;

namespace StudentEnrollment.Features.Users.GetList;

public class GetUserListValidator : AbstractValidator<GetUserListRequest>
{
    public GetUserListValidator()
    {
        RuleFor(x => x.SortOrder)
            .Must(x =>
                x == null
                || x.Equals("asc", StringComparison.OrdinalIgnoreCase)
                || x.Equals("desc", StringComparison.OrdinalIgnoreCase)
            )
            .WithMessage("SortOrder must be either 'asc' or 'desc'.");

        RuleFor(x => x.SortBy)
            .Must(x => x == null || _validColumns.Contains(x, StringComparer.OrdinalIgnoreCase))
            .WithMessage("The specified sort column is invalid.");

        RuleFor(x => x.Search).MaximumLength(256).WithMessage("Search term is too long.");
    }

    private readonly string[] _validColumns = ["Email", "UserName", "Id"];
}
