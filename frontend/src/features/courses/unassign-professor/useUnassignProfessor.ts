import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unassignProfessor } from "./api";
import type { UnassignProfessorRequest } from "@/features/courses/_common/types";

export const useUnassignProfessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UnassignProfessorRequest) =>
      unassignProfessor(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professor-assigned-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });
};
