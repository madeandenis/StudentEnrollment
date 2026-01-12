import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { RegisterPage } from '@/features/auth/register/RegisterPage';
import { LoginPage } from '@/features/auth/login/LoginPage';
import { AppLayout } from './features/_common/components/Layout/AppLayout';
import { StudentsPage } from '@/features/students/StudentsPage';
import { StudentDetailsPage } from '@/features/students/StudentDetailsPage';
import { CoursesPage } from '@/features/courses/CoursesPage';
import { TokenStore } from './lib/token-store';

// Placeholder pages - will be created next
const DashboardPage = () => <div>Dashboard Page - Coming Soon</div>;
const CourseDetailsPage = () => <div>Course Details Page - Coming Soon</div>;
const ProfilePage = () => <div>Profile Page - Coming Soon</div>;

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

// Public routes (no layout)
const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: RegisterPage,
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

// Protected layout route
const protectedLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protected',
    component: AppLayout,
    beforeLoad: () => {
        if (TokenStore.isAccessTokenValid()) {
            return loginRoute;
        }
        return null;
    }
});

// Protected routes (with layout)
const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/',
    component: DashboardPage,
});

const studentsListRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/students',
    component: StudentsPage,
});

const studentDetailsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/students/$id',
    component: StudentDetailsPage,
});

const coursesListRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/courses',
    component: CoursesPage,
});

const courseDetailsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/courses/$id',
    component: CourseDetailsPage,
});

const profileRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/profile',
    component: ProfilePage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
    registerRoute,
    loginRoute,
    protectedLayoutRoute.addChildren([
        dashboardRoute,
        studentsListRoute,
        studentDetailsRoute,
        coursesListRoute,
        courseDetailsRoute,
        profileRoute,
    ]),
]);

// Create router
export const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
