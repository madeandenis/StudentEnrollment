using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Courses.GetList;
using StudentEnrollment.Shared.Domain.Entities;

namespace StudentEnrollment.Features.Courses.Common;

public static class CourseQueryExtensions
{
    extension(IQueryable<Course> query)
    {
        /// <summary>
        /// Applies filtering logic to a course query based on search terms, course codes, 
        /// credit ranges, and seat availability.
        /// </summary>
        /// <param name="request">The filter criteria provided by the user.</param>
        /// <returns>An <see cref="IQueryable{Course}"/> with the applied filters.</returns>
        public IQueryable<Course> ApplySearchFilter(GetCourseListRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Search))
                query = query.Where(c =>
                    EF.Functions.Like(c.Name, $"%{request.Search}%") ||
                    EF.Functions.Like(c.CourseCode, $"%{request.Search}%")
                );

            if (!string.IsNullOrWhiteSpace(request.Code))
                query = query.Where(c => EF.Functions.Like(c.CourseCode, $"%{request.Code}%"));

            if (!string.IsNullOrWhiteSpace(request.Name))
                query = query.Where(c => EF.Functions.Like(c.Name, $"%{request.Name}%"));

            if (request.MinCredits.HasValue)
                query = query.Where(c => c.Credits >= request.MinCredits.Value);

            if (request.MaxCredits.HasValue)
                query = query.Where(c => c.Credits <= request.MaxCredits.Value);

            if (request.HasAvailableSeats.HasValue)
            {
                query = request.HasAvailableSeats.Value
                    ? query.Where(c => c.Enrollments.Count < c.MaxEnrollment)
                    : query.Where(c => c.Enrollments.Count >= c.MaxEnrollment);
            }

            return query;
        }

        /// <summary>
        /// Applies dynamic sorting to the course query based on the requested property and direction.
        /// Defaults to sorting by CreatedAt Descending if no valid sort property is provided.
        /// </summary>
        /// <param name="request">The sorting parameters including SortBy and SortOrder.</param>
        /// <returns>An <see cref="IQueryable{Course}"/> ordered by the specified criteria.</returns>
        public IQueryable<Course> ApplySorting(GetCourseListRequest request)
        {
            var isDesc = request.SortOrder?.Equals("desc", StringComparison.OrdinalIgnoreCase) ?? false;
            var sortBy = request.SortBy?.ToLowerInvariant();

            return sortBy switch
            {
                "coursecode" => isDesc 
                    ? query.OrderByDescending(c => c.CourseCode) 
                    : query.OrderBy(c => c.CourseCode),
                "name" => isDesc 
                    ? query.OrderByDescending(c => c.Name) 
                    : query.OrderBy(c => c.Name),
                "credits" => isDesc 
                    ? query.OrderByDescending(c => c.Credits) 
                    : query.OrderBy(c => c.Credits),
                "maxenrollment" => isDesc 
                    ? query.OrderByDescending(c => c.MaxEnrollment) 
                    : query.OrderBy(c => c.MaxEnrollment),
                "availableseats" => isDesc
                    ? query.OrderByDescending(c => c.MaxEnrollment - c.Enrollments.Count)
                    : query.OrderBy(c => c.MaxEnrollment - c.Enrollments.Count),
                _ => query.OrderByDescending(s => s.CreatedAt)

            };
        }
    }
}