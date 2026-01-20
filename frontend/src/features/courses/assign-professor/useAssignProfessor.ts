import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignProfessor } from "./api";
import type { AssignProfessorRequest } from "@/features/courses/_common/types";

export const useAssignProfessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AssignProfessorRequest) => assignProfessor(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professor-assigned-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });
};
