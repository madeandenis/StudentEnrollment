import { api } from '@/lib/api';

export const enrollStudent = async (courseId: number, studentId: number): Promise<void> => {
    await api.post(`/courses/${courseId}/enroll/${studentId}`);
};
