using FluentValidation;
using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Common.Validators;

public class AddressValidator : AbstractValidator<Address>
{
    public AddressValidator()
    {
        RuleFor(x => x.Address1)
            .NotEmpty()
            .WithMessage("Street address is required.")
            .MaximumLength(255)
            .WithMessage("Address line 1 is too long.");

        RuleFor(x => x.Address2).MaximumLength(255).WithMessage("Address line 2 is too long.");

        RuleFor(x => x.City)
            .NotEmpty()
            .WithMessage("City is required.")
            .MaximumLength(100)
            .WithMessage("City is too long.");

        RuleFor(x => x.County).MaximumLength(100).WithMessage("County is too long.");

        RuleFor(x => x.Country)
            .NotEmpty()
            .WithMessage("Country is required.")
            .MaximumLength(100)
            .WithMessage("Country is too long.");

        RuleFor(x => x.PostalCode)
            .MaximumLength(20)
            .WithMessage("Postal code is too long.")
            .Must(x => x == null || x.All(char.IsLetterOrDigit))
            .WithMessage("Postal code must be alphanumeric.");
    }
}

public static class AddressValidatorExtension
{
    extension<T>(IRuleBuilder<T, Address> ruleBuilder)
    {
        public IRuleBuilderOptions<T, Address> Address() =>
            ruleBuilder.SetValidator(new AddressValidator());
    }
}
