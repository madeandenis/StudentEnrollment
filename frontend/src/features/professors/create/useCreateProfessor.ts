import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProfessor } from "./api";
import type { CreateProfessorRequest } from "./types";

export const useCreateProfessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProfessorRequest) => createProfessor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professors"] });
    },
  });
};
