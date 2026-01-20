import { useQuery } from "@tanstack/react-query";
import { getProfessorDetails } from "./api";

export const useProfessorDetails = (id: string | number | null | undefined) => {
  return useQuery({
    queryKey: ["professor", id],
    queryFn: () => getProfessorDetails(id!),
    enabled: !!id,
  });
};
