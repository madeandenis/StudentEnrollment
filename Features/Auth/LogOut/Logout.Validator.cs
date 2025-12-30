using FluentValidation;

namespace StudentEnrollment.Features.Auth.LogOut;

public class LogoutValidator : AbstractValidator<LogoutRequest>
{
    public LogoutValidator()
    {
        RuleFor(r => r.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.");
    }    
}