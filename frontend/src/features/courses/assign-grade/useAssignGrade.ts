import { useMutation } from "@tanstack/react-query";
import { assignGrade } from "./api";
import type { AssignGradeRequest } from "./types";

export const useAssignGrade = () => {
  return useMutation({
    mutationFn: (request: AssignGradeRequest) => assignGrade(request),
  });
};
