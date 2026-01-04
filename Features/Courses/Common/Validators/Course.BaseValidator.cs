using FluentValidation;
using StudentEnrollment.Features.Courses.Common.Interfaces;

namespace StudentEnrollment.Features.Courses.Common.Validators;

/// <summary>
/// Contains reusable validation rules for course data
/// </summary>
public class CourseBaseValidator : AbstractValidator<ICourseRequest>
{
    public CourseBaseValidator()
    {
        RuleFor(c => c.CourseCode)
            .NotEmpty().WithMessage("Course code is required.")
            .MinimumLength(2).WithMessage("Course code must be at least 2 characters long.")
            .MaximumLength(20).WithMessage("Course code cannot exceed 20 characters.");

        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Course name is required.")
            .MinimumLength(3).WithMessage("Course name must be at least 3 characters long.")
            .MaximumLength(150).WithMessage("Course name cannot exceed 150 characters.");

        RuleFor(c => c.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(c => c.Credits)
            .InclusiveBetween(1, 10).WithMessage("Credits must be between 1 and 10.");

        RuleFor(c => c.MaxEnrollment)
            .GreaterThan(0).WithMessage("Maximum enrollment must be at least 1 student.")
            .LessThanOrEqualTo(1000).WithMessage("Maximum enrollment cannot exceed 1000 students.");
    }
}