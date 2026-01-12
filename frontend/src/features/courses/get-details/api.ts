import { api } from '@/lib/api';
import type { CourseResponse } from '@/features/courses/_common/types';

export const getCourseDetails = async (courseId: number): Promise<CourseResponse> => {
    const response = await api.get<CourseResponse>(`/courses/${courseId}`);
    return response.data;
};
