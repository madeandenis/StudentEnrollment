using FluentValidation;

namespace StudentEnrollment.Features.Common.Pagination;

public class PaginationValidator : AbstractValidator<PaginationRequest>
{
    public PaginationValidator()
    {
        RuleFor(x => x.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page index must be at least 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("Page size must be between 1 and 100.");
    }
}