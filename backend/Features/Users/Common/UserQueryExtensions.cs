using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Users.GetList;
using StudentEnrollment.Shared.Domain.Entities.Identity;

namespace StudentEnrollment.Features.Users.Common;

public static class UserQueryExtensions
{
    extension(IQueryable<ApplicationUser> query)
    {
        /// <summary>
        /// Filters users based on search term matching username or email.
        /// </summary>
        /// <param name="request">The filtering criteria for the user list.</param>
        /// <returns>An <see cref="IQueryable{ApplicationUser}"/> with the filters applied.</returns>
        public IQueryable<ApplicationUser> ApplySearchFilter(GetUserListRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Search))
                query = query.Where(u =>
                    (u.UserName != null && EF.Functions.Like(u.UserName, $"%{request.Search}%"))
                    || (u.Email != null && EF.Functions.Like(u.Email, $"%{request.Search}%"))
                );

            return query;
        }

        /// <summary>
        /// Sorts the user query by properties like Email, UserName, or ID.
        /// </summary>
        /// <param name="request">The sorting parameters.</param>
        /// <returns>An <see cref="IQueryable{ApplicationUser}"/> ordered accordingly.</returns>
        public IQueryable<ApplicationUser> ApplySorting(GetUserListRequest request)
        {
            var isDesc =
                request.SortOrder?.Equals("desc", StringComparison.OrdinalIgnoreCase) ?? false;
            var sortBy = request.SortBy?.ToLowerInvariant();

            return sortBy switch
            {
                "email" => isDesc
                    ? query.OrderByDescending(u => u.Email)
                    : query.OrderBy(u => u.Email),
                "username" => isDesc
                    ? query.OrderByDescending(u => u.UserName)
                    : query.OrderBy(u => u.UserName),
                _ => isDesc ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id),
            };
        }
    }
}
