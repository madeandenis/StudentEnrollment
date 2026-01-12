import { Modal, Text, Group, Button } from '@mantine/core';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps<T = string> {
    opened: boolean;
    /** Name or label of the item being acted on */
    item?: T;
    /** Label for the confirm button */
    confirmLabel?: string;
    /** Title of the modal */
    title?: string;
    /** Text describing the action (can include {item}) */
    description?: (item?: T) => string;
    /** Loading state */
    isLoading?: boolean;
    /** Close handler */
    onClose: () => void;
    /** Confirm handler */
    onConfirm: () => void;
}

export function ConfirmModal<T = string>({
    opened,
    item,
    confirmLabel = 'Confirmă',
    title = 'Confirmare',
    description = (i) => `Ești sigur că vrei să ștergi ${i || 'acest element'}? Această acțiune nu poate fi anulată.`,
    isLoading = false,
    onClose,
    onConfirm,
}: ConfirmModalProps<T>) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <AlertTriangle size={20} color="var(--mantine-color-red-6)" />
                    <Text fw={600}>{title}</Text>
                </Group>
            }
            centered
        >
            <Text size="sm" mb="lg">
                {description(item)}
            </Text>

            <Group justify="flex-end" gap="sm">
                <Button variant="subtle" onClick={onClose} disabled={isLoading}>
                    Anulează
                </Button>
                <Button color="red" onClick={onConfirm} loading={isLoading}>
                    {confirmLabel}
                </Button>
            </Group>
        </Modal>
    );
}
