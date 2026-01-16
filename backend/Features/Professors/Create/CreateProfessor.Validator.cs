using FluentValidation;
using StudentEnrollment.Features.Professors.Common.Validators;

namespace StudentEnrollment.Features.Professors.Create;

public class CreateProfessorValidator : AbstractValidator<CreateProfessorRequest>
{
    public CreateProfessorValidator()
    {
        Include(new ProfessorBaseValidator());
    }
}