import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCourse } from '@/features/courses/delete/api';

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
        },
    });
};
