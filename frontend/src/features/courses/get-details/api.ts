import { api } from '@/lib/api';
import type { CourseResponse } from './types';

export const getCourseDetails = async (courseId: number): Promise<CourseResponse> => {
    const response = await api.get<CourseResponse>(`/courses/${courseId}`);
    return response.data;
};
