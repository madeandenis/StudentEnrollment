/**
 * Local implementation of axios-auth-refresh library
 * Source: https://github.com/Flyrell/axios-auth-refresh
 * 
 * This is a standalone implementation to avoid external dependencies.
 * 
 * Library that helps implement automatic refresh of authorization via axios interceptors.
 * Intercepts failed requests, refreshes authorization, and retries the original request
 * without user interaction. Stalls additional requests while waiting for token refresh.
 */

import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosPromise, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface AxiosAuthRefreshOptions {
    statusCodes?: Array<number>;
    /**
     * Determine whether to refresh, if "shouldRefresh" is configured, The "statusCodes" logic will be ignored
     * @param error AxiosError
     * @returns boolean
     */
    shouldRefresh?(error: AxiosError): boolean;
    retryInstance?: AxiosInstance;
    interceptNetworkError?: boolean;
    pauseInstanceWhileRefreshing?: boolean;
    onRetry?: (requestConfig: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

    /**
     * @deprecated
     * This flag has been deprecated in favor of `pauseInstanceWhileRefreshing` flag.
     * Use `pauseInstanceWhileRefreshing` instead.
     */
    skipWhileRefreshing?: boolean;
}

export interface AxiosAuthRefreshCache {
    skipInstances: AxiosInstance[];
    refreshCall: Promise<any> | undefined;
    requestQueueInterceptorId: number | undefined;
}

export interface AxiosAuthRefreshRequestConfig extends InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
}

export const defaultOptions: AxiosAuthRefreshOptions = {
    statusCodes: [401],
    pauseInstanceWhileRefreshing: false,
};

/**
 * Merges two options objects (options overwrites defaults).
 *
 * @return {AxiosAuthRefreshOptions}
 */
export function mergeOptions(
    defaults: AxiosAuthRefreshOptions,
    options: AxiosAuthRefreshOptions
): AxiosAuthRefreshOptions {
    return {
        ...defaults,
        pauseInstanceWhileRefreshing: options.skipWhileRefreshing,
        ...options,
    };
}

/**
 * Returns TRUE: when error.response.status is contained in options.statusCodes
 * Returns FALSE: when error or error.response doesn't exist or options.statusCodes doesn't include response status
 *
 * @return {boolean}
 */
export function shouldInterceptError(
    error: any,
    options: AxiosAuthRefreshOptions,
    instance: AxiosInstance,
    cache: AxiosAuthRefreshCache
): boolean {
    if (!error) {
        return false;
    }

    if (error.config?.skipAuthRefresh) {
        return false;
    }

    if (
        !(options.interceptNetworkError && !error.response && error.request.status === 0) &&
        (!error.response ||
            (options?.shouldRefresh
                ? !options.shouldRefresh(error)
                : !options.statusCodes?.includes(parseInt(error.response.status))))
    ) {
        return false;
    }

    // Copy config to response if there's a network error, so config can be modified and used in the retry
    if (!error.response) {
        error.response = {
            config: error.config,
        };
    }

    return !options.pauseInstanceWhileRefreshing || !cache.skipInstances.includes(instance);
}

/**
 * Creates refresh call if it does not exist or returns the existing one.
 *
 * @return {Promise<any>}
 */
export function createRefreshCall(
    error: any,
    fn: (error: any) => Promise<any>,
    cache: AxiosAuthRefreshCache
): Promise<any> {
    if (!cache.refreshCall) {
        cache.refreshCall = fn(error);
        if (typeof cache.refreshCall.then !== 'function') {
            console.warn('axios-auth-refresh requires `refreshTokenCall` to return a promise.');
            return Promise.reject();
        }
    }
    return cache.refreshCall;
}

/**
 * Creates request queue interceptor if it does not exist and returns its id.
 *
 * @return {number}
 */
export function createRequestQueueInterceptor(
    instance: AxiosInstance,
    cache: AxiosAuthRefreshCache,
    options: AxiosAuthRefreshOptions
): number {
    if (typeof cache.requestQueueInterceptorId === 'undefined') {
        cache.requestQueueInterceptorId = instance.interceptors.request.use((request: CustomAxiosRequestConfig) => {
            return (cache.refreshCall || Promise.resolve())
                .catch(() => {
                    throw new axios.Cancel('Request call failed');
                })
                .then(() => (options.onRetry ? options.onRetry(request) : request));
        });
    }
    return cache.requestQueueInterceptorId;
}

/**
 * Ejects request queue interceptor and unset interceptor cached values.
 *
 * @param {AxiosInstance} instance
 * @param {AxiosAuthRefreshCache} cache
 */
export function unsetCache(instance: AxiosInstance, cache: AxiosAuthRefreshCache): void {
    if (typeof cache.requestQueueInterceptorId !== 'undefined') {
        instance.interceptors.request.eject(cache.requestQueueInterceptorId);
    }
    cache.requestQueueInterceptorId = undefined;
    cache.refreshCall = undefined;
    cache.skipInstances = cache.skipInstances.filter((skipInstance) => skipInstance !== instance);
}

/**
 * Returns instance that's going to be used when requests are retried
 *
 * @param instance
 * @param options
 */
export function getRetryInstance(instance: AxiosInstance, options: AxiosAuthRefreshOptions): AxiosInstance {
    return options.retryInstance || instance;
}

/**
 * Resend failed axios request.
 *
 * @param {any} error
 * @param {AxiosInstance} instance
 * @return AxiosPromise
 */
export function resendFailedRequest(error: any, instance: AxiosInstance): AxiosPromise {
    error.config.skipAuthRefresh = true;
    return instance(error.response.config);
}

/**
 * Creates an authentication refresh interceptor that binds to any error response.
 * If the response status code is one of the options.statusCodes, interceptor calls the refreshAuthCall
 * which must return a Promise. While refreshAuthCall is running, all the new requests are intercepted and are waiting
 * for the refresh call to resolve. While running the refreshing call, instance provided is marked as a paused instance
 * which indicates the interceptor to not intercept any responses from it. This is because you'd otherwise need to mark
 * the specific requests you make by yourself in order to make sure it's not intercepted. This behavior can be
 * turned off, but use it with caution as you need to mark the requests with `skipAuthRefresh` flag yourself in order to
 * not run into interceptors loop.
 *
 * @param {AxiosInstance} instance - Axios HTTP client instance
 * @param {(error: any) => Promise<AxiosPromise>} refreshAuthCall - refresh token call which must return a Promise
 * @param {AxiosAuthRefreshOptions} options - options for the interceptor @see defaultOptions
 * @return {number} - interceptor id (in case you want to eject it manually)
 */
export default function createAuthRefreshInterceptor(
    instance: AxiosInstance,
    refreshAuthCall: (error: any) => Promise<any>,
    options: AxiosAuthRefreshOptions = {}
): number {
    if (typeof refreshAuthCall !== 'function') {
        throw new Error('axios-auth-refresh requires `refreshAuthCall` to be a function that returns a promise.');
    }

    const cache: AxiosAuthRefreshCache = {
        skipInstances: [],
        refreshCall: undefined,
        requestQueueInterceptorId: undefined,
    };

    return instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: any) => {
            options = mergeOptions(defaultOptions, options);

            if (!shouldInterceptError(error, options, instance, cache)) {
                return Promise.reject(error);
            }

            if (options.pauseInstanceWhileRefreshing) {
                cache.skipInstances.push(instance);
            }

            // If refresh call does not exist, create one
            const refreshing = createRefreshCall(error, refreshAuthCall, cache);

            // Create interceptor that will bind all the others requests until refreshAuthCall is resolved
            createRequestQueueInterceptor(instance, cache, options);

            return refreshing
                .catch((error) => Promise.reject(error))
                .then(() => resendFailedRequest(error, getRetryInstance(instance, options)))
                .finally(() => unsetCache(instance, cache));
        }
    );
}