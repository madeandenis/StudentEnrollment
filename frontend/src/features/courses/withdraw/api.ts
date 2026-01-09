import { api } from "@/lib/api";

export const withdrawStudent = async (courseId: number, studentId: number): Promise<void> => {
    await api.delete(`/courses/${courseId}/withdraw/${studentId}`);
};
