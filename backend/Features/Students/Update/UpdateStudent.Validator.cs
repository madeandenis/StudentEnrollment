using FluentValidation;
using StudentEnrollment.Features.Students.Common.Validators;

namespace StudentEnrollment.Features.Students.Update;

public class UpdateStudentValidator : AbstractValidator<UpdateStudentRequest>
{
    public UpdateStudentValidator()
    {
        Include(new StudentBaseValidator());
    }
}