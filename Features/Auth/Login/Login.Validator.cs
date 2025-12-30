using FluentValidation;

namespace StudentEnrollment.Features.Auth.Login;

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(r => r.Email)
            .EmailAddress();
        RuleFor(r => r.Password)
            .NotEmpty();
    }
}