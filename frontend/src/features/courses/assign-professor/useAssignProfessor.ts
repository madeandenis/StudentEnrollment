import { useMutation } from "@tanstack/react-query";
import { assignProfessor } from "./api";
import type { AssignProfessorRequest } from "@/features/courses/_common/types";

export const useAssignProfessor = () => {
  return useMutation({
    mutationFn: (request: AssignProfessorRequest) => assignProfessor(request),
  });
};
