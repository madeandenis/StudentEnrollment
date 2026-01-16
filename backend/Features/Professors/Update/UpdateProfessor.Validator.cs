using FluentValidation;
using StudentEnrollment.Features.Professors.Common.Validators;

namespace StudentEnrollment.Features.Professors.Update;

public class UpdateProfessorValidator : AbstractValidator<UpdateProfessorRequest>
{
    public UpdateProfessorValidator()
    {
        Include(new ProfessorBaseValidator());
    }
}
