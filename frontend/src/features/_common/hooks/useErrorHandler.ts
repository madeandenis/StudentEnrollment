import { useState, useCallback } from 'react';
import type { ErrorResponse, StatusOverrides } from '@/features/_common/types/error.types';
import { getErrorResponse } from '@/features/_common/utils/error-handler';

/**
 * React hook to manage API errors.
 *
 * Parses errors with `getErrorResponse` and stores them in state.
 * Supports optional HTTP status overrides for custom messages.
 *
 * @param overrides - Optional mapping of HTTP status codes to messages.
 * @returns An object with:
 *   - `errors`: current error state
 *   - `handleError`: parse and set an error
 *   - `clearErrors`: clear errors
 *   - `setErrors`: direct state setter
 */
export function useErrorHandler({ overrides }: { overrides?: StatusOverrides }) {
    const [errors, setErrors] = useState<ErrorResponse | null>(null);

    const handleError = useCallback((error: unknown) => {
        const parsedError = getErrorResponse(error, overrides);
        setErrors(parsedError);
    }, []);

    const clearErrors = useCallback(() => {
        setErrors(null);
    }, []);

    return {
        errors,
        handleError,
        clearErrors,
        setErrors
    };
}