import { useQuery } from '@tanstack/react-query';
import { getStudentDetails } from '@/features/students/get-details/api';

export const useStudentDetails = (studentId: number) => {
    return useQuery({
        queryKey: ['students', 'details', studentId],
        queryFn: () => getStudentDetails(studentId),
        enabled: !!studentId,
    });
};
