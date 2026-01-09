import { useQuery } from '@tanstack/react-query';
import { getStudentList } from './api';
import type { StudentListParams } from './types';

export const useStudentList = (params: StudentListParams) => {
    return useQuery({
        queryKey: ['students', 'list', params],
        queryFn: () => getStudentList(params),
    });
};
