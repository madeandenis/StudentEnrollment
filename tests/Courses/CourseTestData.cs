namespace tests.Courses;

/// <summary>
/// Provides sets of invalid test data for <see cref="Course"/> validation tests.
/// </summary>
public static class CourseTestData
{
    public static IEnumerable<object[]> InvalidNames =>
        new List<object[]>
        {
            new object[] { "" },
            new object[] { "ab" },
            new object[] { new string('a', 151) },
        };

    public static IEnumerable<object[]> InvalidCourseCodes =>
        new List<object[]>
        {
            new object[] { "" },
            new object[] { "C" },
            new object[] { new string('a', 21) },
        };

    public static IEnumerable<object[]> InvalidDescriptions =>
        new List<object[]> { new object[] { "" }, new object[] { new string('a', 501) } };

    public static IEnumerable<object[]> InvalidCredits =>
        new List<object[]> { new object[] { 0 }, new object[] { 11 } };

    public static IEnumerable<object[]> InvalidMaxEnrollments =>
        new List<object[]> { new object[] { 0 }, new object[] { 1001 } };
}
