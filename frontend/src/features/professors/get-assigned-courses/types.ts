export interface AssignedCourseResponse {
    courseId: number;
    code: string;
    name: string;
    credits: number;
    maxEnrollment: number;
    enrolledStudents: number;
    availableSeats: number;
    hasAvailableSeats: boolean;
    createdAt: string;
}

export interface ProfessorAssignedCoursesResponse {
    assignedCourses: AssignedCourseResponse[];
    totalCourses: number;
    totalStudents: number;
}
