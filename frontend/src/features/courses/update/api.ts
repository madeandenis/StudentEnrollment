import { api } from '@/lib/api';
import type { UpdateCourseRequest } from '@/features/courses/update/types';

export const updateCourse = async (courseId: number, data: UpdateCourseRequest): Promise<void> => {
    await api.put(`/courses/${courseId}`, data);
};
