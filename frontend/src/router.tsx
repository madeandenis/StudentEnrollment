import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { RegisterPage } from '@/features/auth/register/RegisterPage';
import { LoginPage } from '@/features/auth/login/LoginPage';
import { AppLayout } from './features/_common/components/Layout/AppLayout';
import { StudentsPage } from '@/features/students/StudentsPage';
import { StudentDetailsPage } from '@/features/students/StudentDetailsPage';
import { CoursesPageWrapper } from '@/features/courses/CoursesPageWrapper';
import { CourseDetailsPage } from '@/features/courses/CourseDetailsPage';
import { TokenStore } from './lib/token-store';
import { ProfilePage } from '@/features/profile/ProfilePage';

import logo from '@/assets/logo.png';

const WelcomePage = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1.5rem'
    }}>
        <img src={logo} alt="Student Enrollment Logo" style={{ width: '200px', height: 'auto' }} />
        <p>Folosește meniul pentru a naviga prin aplicație</p>
    </div>
);
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
    validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
        return {
            redirect: (search.redirect as string) || undefined,
        };
    },
    component: LoginPage,
});

// Protected layout route
const protectedLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protected',
    component: AppLayout,
    beforeLoad: () => {
        if (!TokenStore.isAccessTokenValid()) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.pathname,
                },
            });
        }
    }
});

// Protected routes (with layout)
const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/',
    component: WelcomePage,
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
    component: CoursesPageWrapper,
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

import { MyDataPage } from '@/features/profile/MyDataPage';

const myDataRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/my-data',
    component: MyDataPage,
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
        myDataRoute,
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
