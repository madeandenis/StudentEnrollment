using FluentValidation;

namespace StudentEnrollment.Features.Common.Validators;

public class BirthDateValidator : AbstractValidator<DateOnly>
{
    public BirthDateValidator()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        RuleFor(bd => bd)
            .NotEmpty().WithMessage("Birth date is required.")
            .LessThan(today).WithMessage("Birth date must be in the past.")
            .GreaterThan(today.AddYears(-120)).WithMessage("Birth date is too far in the past.");
    }
}

public static class BirthDateValidatorExtension
{
    extension<T>(IRuleBuilder<T, DateOnly> ruleBuilder)
    {
        public IRuleBuilderOptions<T, DateOnly> BirthDate() => ruleBuilder.SetValidator(new BirthDateValidator());
    }
}