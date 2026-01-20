export interface ProfessorInfo {
  id: number;
  code: string;
  name: string;
}

export interface CourseResponse {
  id: number;
  courseCode: string;
  name: string;
  description: string;
  credits: number;
  maxEnrollment: number;
  enrolledStudents: number;
  availableSeats: number;
  hasAvailableSeats: boolean;
  professor?: ProfessorInfo;
  createdAt: string;
}

export interface AssignProfessorRequest {
  courseId: number;
  professorIdentifier: string;
}

export interface UnassignProfessorRequest extends AssignProfessorRequest { }


