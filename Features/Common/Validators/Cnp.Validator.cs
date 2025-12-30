using FluentValidation;
using StudentEnrollment.Shared.Utilities;

namespace StudentEnrollment.Features.Common.Validators;

public class CnpValidator : AbstractValidator<string>
{
    public CnpValidator()
    {
        RuleFor(s => s)
            .NotEmpty().WithMessage("CNP is required.")
            .Length(13).WithMessage("CNP must be exactly 13 characters long.")
            .Must(s => s.All(char.IsDigit)).WithMessage("CNP must contain only digits.")
            .Must(CnpService.ValidateStructure).WithMessage(s => "Invalid CNP")
            .Must(CnpService.ValidateChecksum).WithMessage(s => "Invalid CNP");
    }
}

public static class CnpValidatorExtensions
{
    extension<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        public IRuleBuilderOptions<T, string> Cnp() =>
            ruleBuilder.SetValidator(new CnpValidator());
    }
}