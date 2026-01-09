export interface CreateCourseRequest {
    name: string;
    courseCode: string;
    description: string;
    credits: number;
    maxEnrollment: number;
}
