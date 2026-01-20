export interface EnrolledCourseResponse {
    courseId: number;
    code: string;
    name: string;
    credits: number;
    enrollmentDate: string;
    grade?: number;
    assignedByProfessor?: string;
}

export interface AcademicSituationResponse {
    enrolledCourses: EnrolledCourseResponse[];
    totalCreditsAccumulated: number;
}
