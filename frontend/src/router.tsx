import {
  createRouter,
  createRoute,
  Outlet,
  redirect,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/register/RegisterPage";
import { LoginPage } from "@/features/auth/login/LoginPage";
import { AppLayout } from "./features/_common/components/Layout/AppLayout";
import { StudentsPage } from "@/features/students/StudentsPage";
import { StudentDetailsPage } from "@/features/students/StudentDetailsPage";
import { ProfessorsPage } from "@/features/professors/ProfessorsPage";
import { ProfessorDetailsPage } from "@/features/professors/ProfessorDetailsPage";
import { CoursesPageWrapper } from "@/features/courses/CoursesPageWrapper";
import { CourseDetailsPage } from "@/features/courses/CourseDetailsPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { refreshToken } from "@/features/auth/refresh/api";
import { getMe } from "@/features/auth/me";
import { UserStore } from "@/lib/stores/userStore";
import { TokenStore } from "@/lib/stores/tokenStore";
import type { ClaimsUser } from "@/features/auth/_common/types";
import WelcomePage from "./features/welcome/WelcomePage";

export interface RouterContext {
  user: ClaimsUser;
  isAdmin: boolean;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

// Public routes (no layout)
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    return {
      redirect: (search.redirect as string) || undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    const isAuthenticated = TokenStore.isAccessTokenValid();

    if (isAuthenticated) {
      return redirect({
        to: search.redirect || "/",
      });
    }
  },
  component: LoginPage,
});

async function hydrateUser(): Promise<ClaimsUser | null> {
  if (UserStore.isHydrated()) {
    return UserStore.getUser();
  }

  try {
    if (!TokenStore.isAccessTokenValid()) {
      const tokenData = await refreshToken();
      TokenStore.setTokens(
        tokenData.accessToken,
        tokenData.accessTokenExpiresAt,
        tokenData.refreshTokenExpiresAt,
        tokenData.tokenType,
      );
    }

    const me = await getMe();
    UserStore.setUser(me.user);

    return me.user;
  } catch {
    TokenStore.clear();
    UserStore.markHydrated();
    return null;
  }
}

// Protected layout route
const protectedLayoutRoute = createRoute<RouterContext>({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: AppLayout,
  beforeLoad: async ({ location }) => {
    const user = await hydrateUser();

    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.pathname,
        },
      });
    }

    return {
      user,
      isAdmin: UserStore.isAdmin(),
    };
  },
});

// Protected routes (with layout)
const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/",
  component: WelcomePage,
});

const studentsListRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/students",
  beforeLoad() {
    if (!UserStore.isAdmin()) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: StudentsPage,
});

const studentDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/students/$id",
  component: StudentDetailsPage,
});

const coursesListRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/courses",
  component: CoursesPageWrapper,
});

const courseDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/courses/$id",
  component: CourseDetailsPage,
});

const professorsListRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/professors",
  beforeLoad() {
    if (!UserStore.isAdmin()) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: ProfessorsPage,
});

const professorDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/professors/$id",
  component: ProfessorDetailsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/profile",
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
    professorsListRoute,
    professorDetailsRoute,
    coursesListRoute,
    courseDetailsRoute,
    profileRoute,
  ]),
]);

// Create router
export const router = createRouter({ routeTree, context: undefined! });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
