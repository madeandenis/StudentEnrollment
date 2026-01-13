import { api } from '@/lib/api';
import type { StudentResponse } from '@/features/students/_common/types';

export const getStudentDetails = async (studentIdentifier: number | string): Promise<StudentResponse> => {
    const response = await api.get<StudentResponse>(`/students/${studentIdentifier}`);
    return response.data;
};
