import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourse } from './api';
import type { UpdateCourseRequest } from './types';

export const useUpdateCourse = (courseId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCourseRequest) => updateCourse(courseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['courses', 'details', courseId] });
        },
    });
};
