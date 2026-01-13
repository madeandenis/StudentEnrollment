import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMe } from '@/features/auth/me/api';
import type { MeResponse } from './types';

export const useMe = (options?: Omit<UseQueryOptions<MeResponse>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: getMe,
        retry: false,
        ...options,
    });
};
