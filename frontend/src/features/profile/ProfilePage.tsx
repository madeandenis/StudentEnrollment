import {
    Paper,
    Title,
    Group,
    Text,
    Avatar,
    Grid,
    Stack,
    Badge,
    Divider,
    ThemeIcon
} from '@mantine/core';
import { Mail, Phone, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '@/features/auth/_contexts/AuthContext';

export function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <Stack gap="lg">
            <Title order={2}>Profilul Meu</Title>

            <Grid>
                {/* Left Column - Identity Card */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p="xl" shadow="sm" withBorder radius="md">
                        <Stack align="center" gap="md">
                            <Avatar
                                size={120}
                                radius={120}
                                color="blue"
                                variant="light"
                            >
                                {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                            </Avatar>

                            <div style={{ textAlign: 'center' }}>
                                <Title order={3}>
                                    {user.firstName} {user.lastName}
                                </Title>
                                <Text c="dimmed" size="sm">
                                    @{user.userName || user.email?.split('@')[0]}
                                </Text>
                            </div>

                            <Group gap="xs" justify="center">
                                {user.roles.map((role) => (
                                    <Badge
                                        key={role}
                                        variant="light"
                                        color={role === 'Admin' ? 'red' : 'blue'}
                                        leftSection={<Shield size={12} />}
                                    >
                                        {role}
                                    </Badge>
                                ))}
                            </Group>
                        </Stack>
                    </Paper>
                </Grid.Col>

                {/* Right Column - Details */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper p="xl" shadow="sm" withBorder radius="md" h="100%">
                        <Stack gap="lg">
                            <Title order={4}>Informații Personale</Title>

                            <Grid>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Group wrap="nowrap" align="flex-start">
                                        <ThemeIcon variant="light" size="lg" color="gray">
                                            <Mail size={20} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" c="dimmed">Email</Text>
                                            <Text size="sm" fw={500}>{user.email}</Text>
                                        </div>
                                    </Group>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Group wrap="nowrap" align="flex-start">
                                        <ThemeIcon variant="light" size="lg" color="gray">
                                            <Phone size={20} />
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" c="dimmed">Telefon</Text>
                                            <Text size="sm" fw={500}>{user.phoneNumber || '-'}</Text>
                                        </div>
                                    </Group>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, sm: 12 }}>
                                    <Divider />
                                </Grid.Col>

                                {user.studentCode && (
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Group wrap="nowrap" align="flex-start">
                                            <ThemeIcon variant="light" size="lg" color="green">
                                                <GraduationCap size={20} />
                                            </ThemeIcon>
                                            <div>
                                                <Text size="xs" c="dimmed">Cod Student</Text>
                                                <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>{user.studentCode}</Text>
                                            </div>
                                        </Group>
                                    </Grid.Col>
                                )}
                            </Grid>
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Stack>
    );
}
