export interface EnrolledStudentResponse {
    studentId: number;
    studentCode: string;
    fullName: string;
    email: string;
    enrollmentDate: string;
    grade?: number;
    assignedByProfessor?: string;
}

export interface CourseEnrolledStudentsResponse {
    enrolledStudents: EnrolledStudentResponse[];
    totalEnrolledStudents: number;
}
