import { useState, useCallback } from 'react';
import type { ErrorResponse, StatusOverrides } from '@/features/_common/types/error.types';
import { getErrorResponse } from '@/features/_common/utils/error-handler';

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