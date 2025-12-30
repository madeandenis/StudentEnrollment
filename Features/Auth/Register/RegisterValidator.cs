using FluentValidation;
using StudentEnrollment.Features.Common.Validators;

namespace StudentEnrollment.Features.Auth.Register;

public class RegisterValidator : AbstractValidator<RegisterRequest>
{
    public RegisterValidator()
    {
        RuleFor(r => r.Email)
            .EmailAddress();
        RuleFor(r => r.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MustContainDigit()
            .MustContainNonAlphanumeric()
            .MustContainUppercase()
            .MustContainLowercase()
            .MustContainUniqueChars(4);
    }
}