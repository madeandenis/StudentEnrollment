import { api } from '@/lib/api';
import type { StudentResponse } from '@/features/students/_common/types';

export const getStudentDetails = async (studentId: number): Promise<StudentResponse> => {
    const response = await api.get<StudentResponse>(`/students/${studentId}`);
    return response.data;
};
