namespace StudentEnrollment.Shared.Security.Common;

public static class Roles
{
    public const string SuperAdmin = "SuAdmin";
    public const string Admin = "Admin";
    
    public static IEnumerable<string> AdminRoles => [SuperAdmin, Admin];
    
    public static IEnumerable<string> All() => [SuperAdmin, Admin];
}
