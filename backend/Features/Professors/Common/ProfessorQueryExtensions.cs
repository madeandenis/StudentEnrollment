using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Professors.GetList;
using StudentEnrollment.Shared.Domain.Entities;

namespace StudentEnrollment.Features.Professors.Common;

public static class ProfessorQueryExtensions
{
    extension(IQueryable<Professor> query)
    {
        /// <summary>
        /// Filters professors based on search terms (name/email), specific email matches,
        /// and registration date ranges.
        /// </summary>
        /// <param name="request">The filtering criteria for the professor list.</param>
        /// <returns>An <see cref="IQueryable{Professor}"/> with the filters applied.</returns>
        public IQueryable<Professor> ApplySearchFilter(GetProfessorListRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Search))
                query = query.Where(p =>
                    EF.Functions.Like(p.FirstName, $"%{request.Search}%")
                    || EF.Functions.Like(p.LastName, $"%{request.Search}%")
                    || EF.Functions.Like(p.Email, $"%{request.Search}%")
                );

            if (!string.IsNullOrWhiteSpace(request.Email))
                query = query.Where(p => EF.Functions.Like(p.Email, $"%{request.Email}%"));

            if (request.RegisteredFrom.HasValue)
                query = query.Where(p => p.CreatedAt >= request.RegisteredFrom.Value);

            if (request.RegisteredTo.HasValue)
                query = query.Where(p => p.CreatedAt <= request.RegisteredTo.Value);

            return query;
        }

        /// <summary>
        /// Sorts the professor query by properties like Name, Email, Phone Number, Professor Code or Registration Date.
        /// </summary>
        /// <param name="request">The sorting parameters.</param>
        /// <returns>An <see cref="IQueryable{Professor}"/> ordered accordingly.</returns>
        public IQueryable<Professor> ApplySorting(GetProfessorListRequest request)
        {
            var isDesc =
                request.SortOrder?.Equals("desc", StringComparison.OrdinalIgnoreCase) ?? false;
            var sortBy = request.SortBy?.ToLowerInvariant();

            return sortBy switch
            {
                "fullname" => isDesc
                    ? query.OrderByDescending(p => p.FirstName).ThenByDescending(p => p.LastName)
                    : query.OrderBy(p => p.FirstName).ThenBy(p => p.LastName),
                "firstname" => isDesc
                    ? query.OrderByDescending(p => p.FirstName)
                    : query.OrderBy(p => p.FirstName),
                "lastname" => isDesc
                    ? query.OrderByDescending(p => p.LastName)
                    : query.OrderBy(p => p.LastName),
                "email" => isDesc
                    ? query.OrderByDescending(p => p.Email)
                    : query.OrderBy(p => p.Email),
                "phonenumber" => isDesc
                    ? query.OrderByDescending(p => p.PhoneNumber)
                    : query.OrderBy(p => p.PhoneNumber),
                "professorcode" => isDesc
                    ? query.OrderByDescending(p => p.ProfessorCode)
                    : query.OrderBy(p => p.ProfessorCode),
                _ => query.OrderByDescending(p => p.CreatedAt),
            };
        }
    }
}
