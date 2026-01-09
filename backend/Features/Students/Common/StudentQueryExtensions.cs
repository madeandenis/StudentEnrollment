using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Students.GetList;
using StudentEnrollment.Shared.Domain.Entities;

namespace StudentEnrollment.Features.Students.Common;

public static class StudentQueryExtensions
{
    extension(IQueryable<Student> query)
    {
        /// <summary>
        /// Filters students based on search terms (name/email), specific email matches, 
        /// and registration date ranges.
        /// </summary>
        /// <param name="request">The filtering criteria for the student list.</param>
        /// <returns>An <see cref="IQueryable{Student}"/> with the filters applied.</returns>
        public IQueryable<Student> ApplySearchFilter(GetStudentListRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Search))
                query = query.Where(s =>
                    EF.Functions.Like(s.FirstName, $"%{request.Search}%") ||
                    EF.Functions.Like(s.LastName, $"%{request.Search}%") ||
                    EF.Functions.Like(s.Email, $"%{request.Search}%")
                );

            if (!string.IsNullOrWhiteSpace(request.Email))
                query = query.Where(s => EF.Functions.Like(s.Email, $"%{request.Email}%"));

            if (request.RegisteredFrom.HasValue)
                query = query.Where(s => s.CreatedAt >= request.RegisteredFrom.Value);

            if (request.RegisteredTo.HasValue)
                query = query.Where(s => s.CreatedAt <= request.RegisteredTo.Value);

            return query;
        }

        /// <summary>
        /// Sorts the student query by properties like Name, Email, or Student Code.
        /// </summary>
        /// <param name="request">The sorting parameters.</param>
        /// <returns>An <see cref="IQueryable{Student}"/> ordered accordingly.</returns>
        public IQueryable<Student> ApplySorting(GetStudentListRequest request)
        {
            var isDesc = request.SortOrder?.Equals("desc", StringComparison.OrdinalIgnoreCase) ?? false;
            var sortBy = request.SortBy?.ToLowerInvariant();

            return sortBy switch
            {
                "firstname" => isDesc 
                    ? query.OrderByDescending(s => s.FirstName) 
                    : query.OrderBy(s => s.FirstName),
                "lastname" => isDesc 
                    ? query.OrderByDescending(s => s.LastName) 
                    : query.OrderBy(s => s.LastName),
                "email" => isDesc 
                    ? query.OrderByDescending(s => s.Email) 
                    : query.OrderBy(s => s.Email),
                "phonenumber" => isDesc
                    ? query.OrderByDescending(s => s.PhoneNumber)
                    : query.OrderBy(s => s.PhoneNumber),
                "dateofbirth" => isDesc
                    ? query.OrderByDescending(s => s.DateOfBirth)
                    : query.OrderBy(s => s.DateOfBirth),
                "studentcode" => isDesc
                    ? query.OrderByDescending(s => s.StudentCode)
                    : query.OrderBy(s => s.StudentCode),
                _ => query.OrderByDescending(s => s.CreatedAt)
            };
        }
    }
}