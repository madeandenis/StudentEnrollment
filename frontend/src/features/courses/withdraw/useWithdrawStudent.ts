import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawStudent } from '@/features/courses/withdraw/api';

export const useWithdrawStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, studentId }: { courseId: number; studentId: number }) =>
            withdrawStudent(courseId, studentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['courses', 'details', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['students', 'enrolled-courses', variables.studentId] });
        },
    });
};
