import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { CoursesPage } from './CoursesPage';
import { MyCoursesPage as StudentCoursesPage } from '@/features/students/MyCoursesPage';
import { MyCoursesPage as ProfessorCoursesPage } from '@/features/professors/MyCoursesPage';

/**
 * Wrapper component that displays different course views based on user role:
 * - Admins/SuperAdmins: See all courses (CoursesPage)
 * - Professors: See their assigned courses (ProfessorCoursesPage)
 * - Students: See only their enrolled courses (StudentCoursesPage)
 */
export function CoursesPageWrapper() {
    const { isAdmin, user } = useAuth();

    // Admins see all courses
    if (isAdmin) {
        return <CoursesPage />;
    }

    // Professors see their assigned courses
    if (user?.professorCode) {
        return <ProfessorCoursesPage />;
    }

    // Students see only their enrolled courses
    return <StudentCoursesPage />;
}
