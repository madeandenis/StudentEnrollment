import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfessor } from "./api";
import type { UpdateProfessorRequest } from "./types";

export const useUpdateProfessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProfessorRequest }) =>
      updateProfessor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["professor", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["professors"] });
    },
  });
};
