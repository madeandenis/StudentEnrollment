using FluentValidation;
using StudentEnrollment.Features.Common.Validators;
using StudentEnrollment.Shared.Utilities;

namespace StudentEnrollment.Features.Students.Create;

public class CreateStudentValidator : AbstractValidator<CreateStudentRequest>
{
    public CreateStudentValidator()
    {
        RuleFor(s => s.Cnp)
            .Cnp()
            .DependentRules(() =>
            {
                RuleFor(s => s.DateOfBirth)
                    .BirthDate()
                    .DependentRules(() =>
                    {
                        RuleFor(s => s)
                            .Must(request =>
                                CnpService.GetBirthDate(request.Cnp) == request.DateOfBirth)
                            .WithMessage("Date of birth does not match the information provided in the CNP.");
                    });
            });
        
        RuleFor(s => s.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MinimumLength(2).WithMessage("First name must be at least 2 characters long.")
            .MaximumLength(50).WithMessage("First name must be at most 50 characters long.");

        RuleFor(s => s.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters long.")
            .MaximumLength(50).WithMessage("Last name must be at most 50 characters long.");
        
        RuleFor(s => s.Email)
            .EmailAddress();

        RuleFor(s => s.PhoneNumber)
            .PhoneNumber();
        
        RuleFor(s => s.Address)
            .Address();
    }
    
    public bool MatchesCnpBirthDate(CreateStudentRequest request)
    {
        return CnpService.GetBirthDate(request.Cnp) == request.DateOfBirth;
    }

}