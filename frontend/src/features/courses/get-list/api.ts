import { api } from '@/lib/api';
import type { CourseResponsePaginatedList, CourseListParams } from '@/features/courses/get-list/types';

export const getCourseList = async (params: CourseListParams): Promise<CourseResponsePaginatedList> => {
    const response = await api.get<CourseResponsePaginatedList>('/courses', { params });
    return response.data;
};
