using FluentValidation;
using StudentEnrollment.Features.Common.Validators;
using StudentEnrollment.Features.Students.Common.Interfaces;
using StudentEnrollment.Shared.Utilities;

namespace StudentEnrollment.Features.Students.Common.Validators;

/// <summary>
/// Contains reusable validation rules for student data
/// </summary>
public class StudentBaseValidator : AbstractValidator<IStudentRequest>
{
    public StudentBaseValidator()
    {
        RuleFor(s => s.Cnp).Cnp();

        RuleFor(s => s.DateOfBirth)
            .BirthDate()
            .Must((request, dob) => CnpService.GetBirthDate(request.Cnp) == dob)
            .WithMessage("Birth date does not match the CNP.");

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
