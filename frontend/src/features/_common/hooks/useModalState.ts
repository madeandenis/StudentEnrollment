import { useState, useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';

export interface ModalState<T = undefined> {
    opened: boolean;
    item: T | null;
    open: (item?: T) => void;
    close: () => void;
    setItem: (item: T | null) => void;
}

/**
 * Generic hook for managing create/edit/delete modal state
 * @template T Type of item being edited/deleted (optional)
 */
export function useModalState<T = undefined>(): ModalState<T> {
    const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [item, setItem] = useState<T | null>(null);

    const open = useCallback((payload?: T) => {
        if (payload !== undefined) setItem(payload);
        openModal();
    }, [openModal]);

    const close = useCallback(() => {
        setItem(null);
        closeModal();
    }, [closeModal]);

    return { opened, item, open, close, setItem };
}
