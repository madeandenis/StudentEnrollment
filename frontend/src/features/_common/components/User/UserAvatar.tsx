import { Avatar, Group, Text } from '@mantine/core';
import { type ClaimsUser } from '@/features/auth/_common/types';
import { getDisplayName, getInitials } from '@/features/_common/utils/userUtils';

interface UserAvatarProps {
    user: ClaimsUser;
    size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'sm' }: UserAvatarProps) {
    const displayName = getDisplayName(user);
    const initials = getInitials(user);

    return (
        <Group gap="xs">
            <Avatar color="blue" radius="xl" size={size}>
                {initials}
            </Avatar>
            <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                    {displayName}
                </Text>
                {user.roles?.length ? (
                    <Text c="dimmed" size="xs">
                        {user.roles.join(', ')}
                    </Text>
                ) : null}
            </div>
        </Group>
    );
}
