import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStudent } from '@/features/students/delete/api';

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
        },
    });
};
