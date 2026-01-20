import { useQuery } from "@tanstack/react-query";
import { getProfessorDetails } from "./api";

export const useProfessorDetails = (id: number) => {
  return useQuery({
    queryKey: ["professor", id],
    queryFn: () => getProfessorDetails(id),
    enabled: !!id,
  });
};
