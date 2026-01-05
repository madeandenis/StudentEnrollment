using StudentEnrollment.Shared.Domain.ValueObjects.Common.Abstractions;

namespace StudentEnrollment.Shared.Domain.ValueObjects;

public class Address : ValueObject
{
    public string Address1 { get; set; }
    // Gets or sets the optional second line of the address (apartment, block, suite, entrance, etc.).
    public string? Address2 { get; set; }
    public string City { get; set; }
    public string? County { get; set; }
    public string Country { get; set; }

    public string? PostalCode { get; set; }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Address1;
        yield return Address2 ?? string.Empty;
        yield return City;
        yield return County ?? string.Empty;
        yield return Country;
        yield return PostalCode ?? string.Empty;
    }

    public static bool operator ==(Address? left, Address? right)
    {
        return EqualOperator(left, right);
    }

    public static bool operator !=(Address? left, Address? right)
    {
        return NotEqualOperator(left!, right!);
    }
}
