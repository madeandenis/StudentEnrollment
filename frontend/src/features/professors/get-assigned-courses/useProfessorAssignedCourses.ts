import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignedCourses } from "./api";

export const useProfessorAssignedCourses = (professorId: number) => {
    return useQuery({
        queryKey: ["professor-assigned-courses", professorId],
        queryFn: () => getProfessorAssignedCourses(professorId),
        enabled: !!professorId,
    });
};
