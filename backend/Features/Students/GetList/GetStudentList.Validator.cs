using FluentValidation;

namespace StudentEnrollment.Features.Students.GetList;

public class GetStudentListValidator : AbstractValidator<GetStudentListRequest>
{
    public GetStudentListValidator()
    {
        RuleFor(x => x.SortOrder)
            .Must(x => x == null ||
                       x.Equals("asc", StringComparison.OrdinalIgnoreCase) ||
                       x.Equals("desc", StringComparison.OrdinalIgnoreCase)
            )
            .WithMessage("SortOrder must be either 'asc' or 'desc'.");

        RuleFor(x => x.SortBy)
            .Must(x => x == null ||
                       _validColumns.Contains(x, StringComparer.OrdinalIgnoreCase)
            )
            .WithMessage("The specified sort column is invalid.");
        
        RuleFor(x => x.Search)
            .MaximumLength(256)
            .WithMessage("Search term is too long.");

        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrEmpty(x.Email))
            .WithMessage("The email filter format is invalid.");
        
        RuleFor(x => x.RegisteredFrom)
            .LessThanOrEqualTo(DateTime.Now)
            .WithMessage("'RegisteredFrom' date cannot be in the future.");

        RuleFor(x => x.RegisteredTo)
            .GreaterThanOrEqualTo(x => x.RegisteredFrom)
            .When(x => x.RegisteredFrom.HasValue && x.RegisteredTo.HasValue)
            .WithMessage("'Registered To' date must be after 'Registered From' date.");
    }

    private readonly string[] _validColumns =
    [
        "FirstName",
        "LastName",
        "Email",
        "PhoneNumber",
        "DateOfBirth",
        "CreatedAt",
        "StudentCode"
    ];
}