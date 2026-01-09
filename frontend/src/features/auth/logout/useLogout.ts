import { useMutation } from '@tanstack/react-query';
import { logout } from '@/features/auth/logout/api';

export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
    });
};
