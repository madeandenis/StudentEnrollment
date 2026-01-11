import { Paper, Group, Text, CloseButton, Stack, Box, type BoxProps } from '@mantine/core';
import { AlertCircle } from 'lucide-react';

export type ErrorDictionary = Record<string, string[]>;

interface ErrorAlertProps extends BoxProps {
    errors: string | ErrorDictionary | null;
    onClose?: () => void;
}

export default function ErrorAlert({ errors, onClose, ...others }: ErrorAlertProps) {
    if (!errors) return null;

    const renderContent = () => {

        if (typeof errors === 'string') {
            return (
                <Text size="sm" c="red.8" fw={600} style={{ flex: 1 }}>
                    {errors}
                </Text>
            );
        }

        return (
            <Stack gap={8} style={{ flex: 1 }}>
                {Object.entries(errors).map(([field, messages]) => (
                    <Box key={field}>
                        <Text size="sm" c="red.7" fw={600} mb={4}>
                            {field}:
                        </Text>
                        <Stack gap={4}>
                            {messages.map((msg, index) => (
                                <Text key={index} size="sm" c="red.8" style={{ display: 'flex', gap: 6 }}>
                                    <span>•</span>
                                    <span>{msg}</span>
                                </Text>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        );
    };

    return (
        <Paper
            shadow="xs"
            withBorder
            p="sm"
            radius="md"
            style={{
                borderColor: 'var(--mantine-color-red-3)',
                backgroundColor: 'var(--mantine-color-red-0)'
            }}
            {...others}
        >
            <Group gap="xs" align="flex-start" wrap="nowrap">
                <AlertCircle
                    size={16}
                    style={{ color: 'var(--mantine-color-red-6)', flexShrink: 0, marginTop: 2 }}
                />

                {renderContent()}

                {onClose && (
                    <CloseButton
                        size="sm"
                        variant="transparent"
                        c="red.6"
                        onClick={onClose}
                        aria-label="Close alert"
                    />
                )}
            </Group>
        </Paper>
    );
}   