import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfessor } from "./api";

export const useDeleteProfessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProfessor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professors"] });
    },
  });
};
