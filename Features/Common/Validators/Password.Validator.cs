using FluentValidation;

namespace StudentEnrollment.Features.Common.Validators;

public static class PasswordValidatorExtensions
{
    extension<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        public IRuleBuilderOptions<T, string> MustContainDigit() =>
            ruleBuilder.Must(s => s.Any(char.IsDigit))
                .WithMessage("The password must contain at least one digit.");

        public IRuleBuilderOptions<T, string> MustContainNonAlphanumeric() =>
            ruleBuilder.Must(s => s.Any(c => !char.IsLetterOrDigit(c)))
                .WithMessage("The password must contain at least one non-alphanumeric character.");

        public IRuleBuilderOptions<T, string> MustContainUppercase() =>
            ruleBuilder.Must(s => s.Any(char.IsUpper))
                .WithMessage("The password must contain at least one uppercase letter.");

        public IRuleBuilderOptions<T, string> MustContainLowercase() =>
            ruleBuilder.Must(s => s.Any(char.IsLower))
                .WithMessage("The password must contain at least one lowercase letter.");

        public IRuleBuilderOptions<T, string> MustContainUniqueChars(int count) =>
            ruleBuilder.Must(s => s.Distinct().Count() >= count)
                .WithMessage($"The password must contain at least {count} unique characters.");
    }
}