import { useQuery } from '@tanstack/react-query';
import { getStudentDetails } from '@/features/students/get-details/api';

export const useStudentDetails = (studentIdentifier: number | string | null) => {
    return useQuery({
        queryKey: ['students', 'details', studentIdentifier],
        queryFn: () => getStudentDetails(studentIdentifier!),
        enabled: !!studentIdentifier,
    });
};
