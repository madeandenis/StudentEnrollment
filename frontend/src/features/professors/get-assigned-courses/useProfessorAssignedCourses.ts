import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignedCourses } from "./api";

export const useProfessorAssignedCourses = (professorIdentifier: string | number | null | undefined) => {
    return useQuery({
        queryKey: ["professor-assigned-courses", professorIdentifier],
        queryFn: () => getProfessorAssignedCourses(professorIdentifier!),
        enabled: !!professorIdentifier,
    });
};
