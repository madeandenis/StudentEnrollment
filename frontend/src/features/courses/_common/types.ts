export interface CourseResponse {
    id: number;
    courseCode: string;
    name: string;
    credits: number;
    maxEnrollment: number;
    enrolledStudents: number;
    availableSeats: number;
    hasAvailableSeats: boolean;
    createdAt: string;
}
