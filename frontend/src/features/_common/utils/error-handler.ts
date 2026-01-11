import { AxiosError } from 'axios';
import type { ErrorDictionary } from '../components/ErrorAlert';
import type { ErrorResponse, StatusOverrides } from '../types/error.types';

/**
 * Parses validation errors from the response data.
 *
 * @param data - The response data that may contain validation errors.
 * @returns An `ErrorDictionary` mapping field names to arrays of error messages, or `null` if none exist.
 */
function parseValidationErrors(data: any): ErrorDictionary | null {
    if (!data?.errors || typeof data.errors !== 'object' || Array.isArray(data.errors)) {
        return null;
    }

    const dict: ErrorDictionary = {};

    for (const [key, value] of Object.entries(data.errors)) {
        const messages = Array.isArray(value) ? value : [value];
        const validMessages = messages.filter((msg): msg is string => typeof msg === 'string');

        if (validMessages.length > 0) {
            dict[key] = validMessages;
        }
    }

    return Object.keys(dict).length > 0 ? dict : null;
}

/**
 * Returns a default error message based on the HTTP status code.
 *
 * @param status - The HTTP status code.
 * @returns A user-friendly error message corresponding to the status code.
 */
function getFallbackByStatus(status?: number): string {
    switch (status) {
        case 400: return 'Datele introduse nu sunt valide.';
        case 401: return 'Nu sunteți autentificat.';
        case 403: return 'Nu aveți permisiunea necesară.';
        case 404: return 'Resursa nu a fost găsită.';
        case 409: return 'Există un conflict cu datele existente.';
        case 500: return 'Eroare de server. Încercați mai târziu.';
        default: return 'A apărut o eroare neașteptată.';
    }
}

/**
 * Extracts a user-friendly error message from an Axios error response.
 *
 * The function attempts, in order:
 * 1. Status overrides (if provided)
 * 2. Validation errors from `data.errors`
 * 3. `data.detail` or `data.message` fields
 * 4. Fallback message based on HTTP status
 *
 * @param error - The error object to extract the message from. Usually an `AxiosError`.
 * @param overrides - Optional mapping of HTTP status codes to custom messages.
 * @returns An `ErrorResponse` which can be a string message or an `ErrorDictionary`.
 */
export function getErrorResponse(error: unknown, overrides?: StatusOverrides): ErrorResponse {
    if (!(error instanceof AxiosError)) {
        return 'A apărut o eroare neașteptată.';
    }

    const status = error.response?.status;
    const data = error.response?.data;

    if (status && overrides && overrides[status]) {
        return overrides[status];
    }

    const validationDict = parseValidationErrors(data);
    if (validationDict) return validationDict;

    if (typeof data?.detail === 'string') return data.detail;
    if (typeof data?.message === 'string') return data.message;

    return getFallbackByStatus(status);
}