import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { CoursesPage } from './CoursesPage';
import { MyCoursesPage } from '@/features/students/MyCoursesPage';

/**
 * Wrapper component that displays different course views based on user role:
 * - Admins/SuperAdmins: See all courses (CoursesPage)
 * - Students: See only their enrolled courses (MyCoursesPage)
 */
export function CoursesPageWrapper() {
    const { isAdmin } = useAuth();

    // Admins see all courses
    if (isAdmin) {
        return <CoursesPage />;
    }

    // Students see only their enrolled courses
    return <MyCoursesPage />;
}
