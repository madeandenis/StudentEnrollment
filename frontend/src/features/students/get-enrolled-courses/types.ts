export interface EnrolledCourseResponse {
    courseId: number;
    code: string;
    name: string;
    credits: number;
    enrollmentDate: string;
}

export interface AcademicSituationResponse {
    enrolledCourses: EnrolledCourseResponse[];
    totalCreditsAccumulated: number;
}
