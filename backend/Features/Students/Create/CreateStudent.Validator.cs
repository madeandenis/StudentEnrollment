using FluentValidation;
using StudentEnrollment.Features.Students.Common.Validators;

namespace StudentEnrollment.Features.Students.Create;

public class CreateStudentValidator : AbstractValidator<CreateStudentRequest>
{
    public CreateStudentValidator()
    {
        Include(new StudentBaseValidator());
    }
}