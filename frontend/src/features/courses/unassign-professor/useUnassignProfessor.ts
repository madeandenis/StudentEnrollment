import { useMutation } from "@tanstack/react-query";
import { unassignProfessor } from "./api";
import type { UnassignProfessorRequest } from "@/features/courses/_common/types";

export const useUnassignProfessor = () => {
  return useMutation({
    mutationFn: (request: UnassignProfessorRequest) =>
      unassignProfessor(request),
  });
};
