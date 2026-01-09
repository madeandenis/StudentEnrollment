import { api } from "@/lib/api";

export const deleteCourse = async (courseId: number): Promise<void> => {
    await api.delete(`/courses/${courseId}`);
};
