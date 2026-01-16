using StudentEnrollment.Shared.Domain.Entities;
using tests.Common;

namespace tests.Professors;


/// <summary>
/// Provides sets of invalid test data for <see cref="Professor"/> validation tests.
/// </summary>
public static class ProfessorInvalidTestData
{
    public static IEnumerable<object[]> InvalidUserIds =>
        new List<object[]>
        {
            new object[] { 0 },
            new object[] { -1 },
        };

    public static IEnumerable<object[]> InvalidFirstNames =>
        new List<object[]>
        {
            new object[] { "" },
            new object[] { "a" },
            new object[] { new string('a', 36) },
        };

    public static IEnumerable<object[]> InvalidLastNames =>
        new List<object[]>
        {
            new object[] { "" },
            new object[] { "a" },
            new object[] { new string('a', 36) },
        };

    public static IEnumerable<object[]> InvalidPhoneNumbers =>
        CommonInvalidTestData.InvalidPhoneNumbers;

    public static IEnumerable<object[]> InvalidAddresses =>
        CommonInvalidTestData.InvalidAddresses;
}