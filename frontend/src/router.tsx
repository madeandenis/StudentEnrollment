import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { RegisterPage } from '@/features/auth/register/RegisterPage';
import { LoginPage } from '@/features/auth/login/LoginPage';

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

// Auth routes
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

// Index route
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Home Page</div>,
});

// Create route tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    registerRoute,
    loginRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
