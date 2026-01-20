import { useQuery } from '@tanstack/react-query';
import { getUserList } from './api';
import type { UserListParams } from './types';

export const useUserList = (params: UserListParams) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => getUserList(params),
    });
};
