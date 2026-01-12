import { Stack, NavLink, Divider } from '@mantine/core';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/_contexts/AuthContext';
import type { ClaimsUser } from '@/features/auth/_common/types';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    roles?: string[];
    claims?: Array<keyof ClaimsUser>;
}

interface SidebarProps {
    navItems: NavItem[];
    userNavItems: NavItem[];
}

function hasRole(user: ClaimsUser | null, role: string): boolean {
    if (!user) return false;
    return user.roles.includes(role);
}

function hasClaim(user: ClaimsUser | null, claim: keyof ClaimsUser): boolean {
    if (!user) return false;
    return Boolean(user[claim]);
}

function canSee(item: NavItem, user: ClaimsUser | null): boolean {
    if (!item.roles && !item.claims) return true;

    const userHasRole =
        item.roles?.some(role => hasRole(user, role)) ?? false;

    const userHasAnyClaim =
        item.claims?.some(claim => hasClaim(user, claim)) ?? false;

    return userHasRole || userHasAnyClaim;
}

function isSectionActive(currentPath: string, itemPath: string) {
    if (itemPath === '/') return currentPath === '/';
    return currentPath.startsWith(itemPath);
}

export function Sidebar({ navItems, userNavItems }: SidebarProps) {
    const navigate = useNavigate();
    const routerState = useRouterState();
    const { user } = useAuth();

    const currentPath = routerState.location.pathname;

    const filteredNavItems = navItems.filter(item => canSee(item, user));
    const filteredUserNavItems = userNavItems.filter(item => canSee(item, user));

    const handleNavigation = (path: string) => {
        navigate({ to: path } as any);
    };

    return (
        <Stack gap="xs" style={{ height: '100%' }}>
            {/* Main Navigation */}

            {filteredNavItems.map((item) => (
                <NavLink
                    key={item.path}
                    label={item.label}
                    leftSection={item.icon}
                    active={isSectionActive(currentPath, item.path)}
                    onClick={() => handleNavigation(item.path)}
                    style={{ borderRadius: '8px', marginBottom: '4px' }}
                />
            ))}

            {
                filteredNavItems.length > 0 && (
                    <Divider />
                )
            }

            {/* User Section */}
            {filteredUserNavItems.map((item) => (
                <NavLink
                    key={item.path}
                    label={item.label}
                    leftSection={item.icon}
                    active={currentPath === item.path}
                    onClick={() => handleNavigation(item.path)}
                    style={{ borderRadius: '8px', marginBottom: '4px' }}
                />
            ))}
        </Stack>
    );
}
