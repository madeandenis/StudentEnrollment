import { api } from '@/lib/api';
import type { StudentResponsePaginatedList, StudentListParams } from '@/features/students/get-list/types';

export const getStudentList = async (params: StudentListParams): Promise<StudentResponsePaginatedList> => {
    const response = await api.get<StudentResponsePaginatedList>('/students', { params });
    return response.data;
};
