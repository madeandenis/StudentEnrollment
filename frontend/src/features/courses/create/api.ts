import { api } from '@/lib/api';
import type { CreateCourseRequest } from '@/features/courses/create/types';

export const createCourse = async (data: CreateCourseRequest): Promise<void> => {
    await api.post('/courses', data);
};
