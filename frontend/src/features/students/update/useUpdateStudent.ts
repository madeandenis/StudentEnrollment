import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudent } from './api';
import type { UpdateStudentRequest } from './types';

export const useUpdateStudent = (studentId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateStudentRequest) => updateStudent(studentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['students', 'details', studentId] });
        },
    });
};
