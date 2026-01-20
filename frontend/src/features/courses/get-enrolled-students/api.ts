import { api } from '@/lib/api';
import type { CourseEnrolledStudentsResponse } from './types';

export const getCourseEnrolledStudents = async (
    courseIdentifier: string | number
): Promise<CourseEnrolledStudentsResponse> => {
    const response = await api.get(`/courses/${courseIdentifier}/students`);
    return response.data;
};
