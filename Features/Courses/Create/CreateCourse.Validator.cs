using FluentValidation;
using StudentEnrollment.Features.Courses.Common.Validators;

namespace StudentEnrollment.Features.Courses.Create;

public class CreateCourseValidator : AbstractValidator<CreateCourseRequest>
{
    public CreateCourseValidator()
    {
        Include(new CourseBaseValidator());
    }
}