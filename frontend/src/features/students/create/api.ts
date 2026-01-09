import { api } from '@/lib/api';
import type { CreateStudentRequest } from '@/features/students/create/types';

export const createStudent = async (data: CreateStudentRequest): Promise<void> => {
    await api.post('/students', data);
};
