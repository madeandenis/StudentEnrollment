using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace tests.Common;

public static class ResultsExtension
{
    extension(IResult result)
    {
        private TResult AssertResult<TResult>(int expectedStatusCode)
            where TResult : IStatusCodeHttpResult
        {
            var typedResult = Assert.IsType<TResult>(result);
            Assert.Equal(expectedStatusCode, typedResult.StatusCode);
            return typedResult;
        }
        
        public Ok AssertOk() =>
            AssertResult<Ok>(result, StatusCodes.Status200OK);
        
        public NoContent AssertNoContent() =>
            AssertResult<NoContent>(result, StatusCodes.Status204NoContent);
        
        public Created<T> AssertCreated<T>(int expectedStatusCode = 201) =>
            AssertResult<Created<T>>(result, expectedStatusCode);

        public BadRequest<T> AssertBadRequest<T>(int expectedStatusCode = 400) =>
            AssertResult<BadRequest<T>>(result, expectedStatusCode);

        public NotFound<T> AssertNotFound<T>(int expectedStatusCode = 404) =>
            AssertResult<NotFound<T>>(result, expectedStatusCode);

        public Conflict<T> AssertConflict<T>(int expectedStatusCode = 409) =>
            AssertResult<Conflict<T>>(result, expectedStatusCode);
        
        public HttpValidationProblemDetails AssertValidationFailed(int expectedStatusCode = 400)
        {
            var problemResult = Assert.IsAssignableFrom<ProblemHttpResult>(result);
            Assert.Equal(expectedStatusCode, problemResult.StatusCode);

            var validationDetails = problemResult.ProblemDetails as HttpValidationProblemDetails;
            Assert.NotNull(validationDetails);

            Assert.NotEmpty(validationDetails.Errors);

            return validationDetails;
        }
    }
}
