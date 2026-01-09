import { useQuery } from '@tanstack/react-query';
import { getCourseList } from '@/features/courses/get-list/api';
import type { CourseListParams } from '@/features/courses/get-list/types';

export const useCourseList = (params: CourseListParams) => {
    return useQuery({
        queryKey: ['courses', 'list', params],
        queryFn: () => getCourseList(params),
    });
};
