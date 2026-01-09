import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollStudent } from './api';

export const useEnrollStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, studentId }: { courseId: number; studentId: number }) =>
            enrollStudent(courseId, studentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['courses', 'details', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['students', 'enrolled-courses', variables.studentId] });
        },
    });
};
