namespace tests.Common;

public static class CommonInvalidTestData
{
    public static IEnumerable<object[]> InvalidPhoneNumbers =>
        new List<object[]>
        {
            new object[] { "" },                      // empty
            new object[] { "123" },                   // too short
            new object[] { "123456789012345678901" }, // too long (>20)
            new object[] { "abcdef" },                // invalid chars
            new object[] { "+12(3b)-56a78" },         // contains letters
            new object[] { "++1234567890" },          // invalid format
        };

    public static IEnumerable<object[]> InvalidAddresses =>
        new List<object[]>
        {
            // Empty required fields
            new object[]
            {
                new StudentEnrollment.Shared.Domain.ValueObjects.Address
                {
                    Address1 = "",
                    City = "",
                    Country = ""
                }
            },

            // Too long fields
            new object[]
            {
                new StudentEnrollment.Shared.Domain.ValueObjects.Address
                {
                    Address1 = new string('a', 256), // >255
                    Address2 = new string('a', 256), // >255
                    City = new string('a', 101),     // >100
                    County = new string('a', 101),   // >100
                    Country = new string('a', 101),  // >100
                    PostalCode = new string('a', 21) // >20
                }
            },

            // Invalid postal code (non-alphanumeric)
            new object[]
            {
                new StudentEnrollment.Shared.Domain.ValueObjects.Address
                {
                    Address1 = "123 Main St",
                    City = "Test City",
                    Country = "Test Country",
                    PostalCode = "12#45!"
                }
            }
        };
}