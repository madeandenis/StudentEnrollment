using System.Text.RegularExpressions;
using FluentValidation;

namespace StudentEnrollment.Features.Common.Validators;

public partial class PhoneValidator : AbstractValidator<string>
{
    public PhoneValidator()
    {
        RuleFor(s => s)
            .NotEmpty().WithMessage("Phone number is required.")
            .MinimumLength(10).WithMessage("Phone number must not be less than 10 characters.")
            .MaximumLength(20).WithMessage("Phone number must not exceed 20 characters.")
            .Matches(PhoneRegex()).WithMessage("Phone number is not valid.");
    }

    [GeneratedRegex(@"((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}")]
    private static partial Regex PhoneRegex();
}

public static class PhoneValidatorExtensions
{
    extension<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        public IRuleBuilderOptions<T, string> PhoneNumber() =>
            ruleBuilder.SetValidator(new PhoneValidator());
    }
}