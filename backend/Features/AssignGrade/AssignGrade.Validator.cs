using FluentValidation;

namespace StudentEnrollment.Features.AssignGrade;

public class AssignGradeValidator : AbstractValidator<AssignGradeRequest>
{
    public AssignGradeValidator()
    {
        RuleFor(r => r.Grade)
            .InclusiveBetween(1m, 10m)
            .WithMessage("Grade must be between 1 and 10.")
            .Must(HaveMaxTwoDecimalPlaces)
            .WithMessage("Grade can have at most 2 decimal places.");
    }
    
    private bool HaveMaxTwoDecimalPlaces(decimal grade)
    {
        return decimal.Round(grade, 2) == grade;
    }
}