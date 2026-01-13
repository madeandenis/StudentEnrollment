import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from '@tanstack/react-router';
import { Users, BookOpen, User, FileText } from 'lucide-react';
import { Sidebar } from '@/features/_common/components/Layout/Sidebar';
import { HeaderContent } from '@/features/_common/components/Layout/HeaderContent';
import { AuthProvider } from '@/features/auth/_contexts/AuthContext';
import { useRouteContext } from '@tanstack/react-router';
import type { RouterContext } from '@/router';

export function AppLayout() {
    const context = useRouteContext({ strict: false }) as RouterContext;
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    return (
        <AuthProvider value={context}>
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 280,
                    breakpoint: 'sm',
                    collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
                }}
                padding="md"
            >
                <AppShell.Header>
                    <HeaderContent
                        mobileOpened={mobileOpened}
                        toggleMobile={toggleMobile}
                        desktopOpened={desktopOpened}
                        toggleDesktop={toggleDesktop}
                    />
                </AppShell.Header>

                <AppShell.Navbar p="md">
                    <Sidebar
                        toggleMobile={toggleMobile}
                        toggleDesktop={() => { }}
                        navItems={[
                            {
                                label: 'Studenți',
                                icon: <Users size={20} />,
                                path: '/students',
                                roles: ['SuAdmin', 'Admin']
                            },
                            {
                                label: 'Cursuri',
                                icon: <BookOpen size={20} />,
                                path: '/courses',
                                roles: ['SuAdmin', 'Admin'],
                                claims: ['studentCode']
                            },
                        ]}
                        userNavItems={[
                            {
                                label: 'Profil',
                                icon: <User size={20} />,
                                path: '/profile',
                            },
                            {
                                label: 'Datele Mele',
                                icon: <FileText size={20} />,
                                path: '/my-data',
                            },
                        ]}
                    />
                </AppShell.Navbar>

                <AppShell.Main>
                    <Outlet />
                </AppShell.Main>
            </AppShell >
        </AuthProvider>
    );
}
