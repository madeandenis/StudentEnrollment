namespace StudentEnrollment.Features.Common.Requests;

public class AddressRequest
{
    public string Address1 { get; set; }
    public string? Address2 { get; set; }
    public string City { get; set; }
    public string? County { get; set; }
    public string Country { get; set; }
    public string? PostalCode { get; set; }
}