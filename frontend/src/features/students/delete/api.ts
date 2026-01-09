import { api } from "@/lib/api";

export const deleteStudent = async (studentId: number): Promise<void> => {
    await api.delete(`/students/${studentId}`);
};
