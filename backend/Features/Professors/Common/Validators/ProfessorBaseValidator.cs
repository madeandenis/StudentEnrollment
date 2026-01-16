using FluentValidation;
using StudentEnrollment.Features.Common.Validators;
using StudentEnrollment.Features.Professors.Common.Interfaces;

namespace StudentEnrollment.Features.Professors.Common.Validators;

/// <summary>
/// Contains reusable validation rules for professor data
/// </summary>
public class ProfessorBaseValidator : AbstractValidator<IProfessorRequest>
{
    public ProfessorBaseValidator()
    {
        RuleFor(s => s.UserId)
            .NotNull()
            .WithMessage("User ID is required.")
            .GreaterThan(0)
            .WithMessage("User ID must be greater than 0.");

        RuleFor(s => s.FirstName)
            .NotEmpty()
            .WithMessage("First name is required")
            .MinimumLength(2)
            .WithMessage("First name must be at least 2 characters long.")
            .MaximumLength(35)
            .WithMessage("First name must be at most 35 characters long.");

        RuleFor(s => s.LastName)
            .NotEmpty()
            .WithMessage("Last name is required")
            .MinimumLength(2)
            .WithMessage("Last name must be at least 2 characters long.")
            .MaximumLength(35)
            .WithMessage("Last name must be at most 35 characters long.");

        RuleFor(s => s.Email).EmailAddress();

        RuleFor(s => s.PhoneNumber).PhoneNumber();

        RuleFor(s => s.Address).Address();
    }
}
