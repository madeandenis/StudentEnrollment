import { api } from '@/lib/api';
import type { UpdateStudentRequest } from '@/features/students/update/types';

export const updateStudent = async (studentId: number, data: UpdateStudentRequest): Promise<void> => {
    await api.put(`/students/${studentId}`, data);
};
