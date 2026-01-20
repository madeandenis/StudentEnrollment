import { api } from "@/lib/api";

export const deleteProfessor = async (id: number): Promise<void> => {
  await api.delete(`/professors/${id}`);
};
