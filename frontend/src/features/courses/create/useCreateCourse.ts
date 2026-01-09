import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '@/features/courses/create/api';

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
        },
    });
};
