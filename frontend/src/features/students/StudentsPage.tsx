import { useCallback } from 'react';
import { Button, Paper, Title, Group, Text, Stack, Loader, Center, Divider } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { StudentFormModal } from '@/features/students/components/StudentFormModal';
import { StudentsTable } from '@/features/students/components/StudentsTable';
import { useStudentList } from '@/features/students/get-list/useStudentList';
import { useDeleteStudent } from '@/features/students/delete/useDeleteStudent';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';
import { useTableState } from '@/features/_common/hooks/useTableState';
import { Pagination } from '../_common/components/Pagination';
import { useModalState } from '@/features/_common/hooks/useModalState';
import { ConfirmModal } from '../_common/components/ConfirmModal';
import { SearchBar } from '../_common/components/SearchBar';

export function StudentsPage() {
    const navigate = useNavigate();

    const formModal = useModalState<{ studentId?: number }>();
    const deleteModal = useModalState<{ id: number; name: string }>();

    const table = useTableState({
        initialPageSize: 10,
        initialFilters: {
            search: '',
            sortBy: 'FullName',
            sortOrder: 'asc',
        },
    });

    // Fetch students
    const { data, isLoading, isError, error } = useStudentList({
        PageIndex: table.pageIndex,
        PageSize: table.pageSize,
        Search: table.filters.search || undefined,
        SortBy: table.filters.sortBy,
        SortOrder: table.filters.sortOrder,
    });

    // Errors
    const { errors: deleteErrors, handleError: handleDeleteError, clearErrors: clearDeleteErrors } = useErrorHandler({});

    // Handlers
    const handleView = useCallback((id: number) => {
        navigate({ to: `/students/${id}` });
    }, [navigate]);

    const handleCreate = useCallback(() => formModal.open(), [formModal]);

    const handleEdit = useCallback((id: number) => {
        formModal.open({ studentId: id });
    }, [formModal]);

    const handleDeleteClick = (student: { id: number; fullName: string }) => {
        deleteModal.open({ id: student.id, name: student.fullName });
    };


    const deleteStudentMutation = useDeleteStudent();
    const handleDeleteConfirm = async () => {
        if (!deleteModal.item) return;
        try {
            await deleteStudentMutation.mutateAsync(deleteModal.item.id);
            deleteModal.close();
            clearDeleteErrors();
        } catch (error: any) {
            handleDeleteError(error);
        }
    };

    return (
        <>
            <Stack gap="lg">
                {/* Page Header */}
                <Group justify="space-between" align="end">
                    <div>
                        <Title order={2} c="dark.4">Studenți</Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            Gestionează studenții înregistrați în sistem
                        </Text>
                    </div>
                    <Button
                        leftSection={<Plus size={16} />}
                        onClick={handleCreate}
                        variant="filled"
                        color="blue"
                        size="sm"
                    >
                        Adaugă Student
                    </Button>
                </Group>

                {/* Content Card */}
                <Paper p="lg" shadow="xs" withBorder bg="white" radius="md">
                    <Stack gap="lg">
                        {/* Search Bar */}
                        <SearchBar
                            onSearch={table.setSearch}
                            placeholder="Caută după nume sau email..."
                        />

                        {/* Error Display */}
                        {isError && (
                            <ErrorAlert
                                errors={error?.message || 'A apărut o eroare la încărcarea studenților'}
                                onClose={() => { }}
                            />
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <Center py="xl">
                                <Loader size="lg" color="gray" />
                            </Center>
                        )}

                        {/* Table */}
                        {!isLoading && !isError && data && (
                            <>
                                <StudentsTable
                                    students={data.items}
                                    sortBy={table.filters.sortBy}
                                    sortOrder={table.filters.sortOrder}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                    onSort={table.setSort}
                                />

                                <Divider color="gray.1" />

                                {/* Pagination */}
                                <Pagination
                                    currentPage={table.pageIndex}
                                    totalPages={data.pageCount}
                                    pageSize={table.pageSize}
                                    totalItems={data.itemsCount}
                                    onPageChange={table.setPageIndex}
                                    onPageSizeChange={table.setPageSize}
                                    itemLabel="studenți"
                                />
                            </>
                        )}
                    </Stack>
                </Paper>
            </Stack>

            {/* Modals */}
            <StudentFormModal
                opened={formModal.opened}
                studentId={formModal.item?.studentId}
                onClose={formModal.close}
            />

            {deleteModal.opened && deleteModal.item && (
                <ConfirmModal
                    opened={deleteModal.opened}
                    item={deleteModal.item.name}
                    confirmLabel="Șterge Student"
                    title="Confirmare ștergere"
                    description={(name) =>
                        `Ești sigur că vrei să ștergi studentul ${name}? Această acțiune nu poate fi anulată.`
                    }
                    isLoading={deleteStudentMutation.isPending}
                    onClose={deleteModal.close}
                    onConfirm={handleDeleteConfirm}
                />
            )}

            {/* Delete Error Alert in Modal */}
            {deleteErrors && deleteModal.opened && (
                <ErrorAlert
                    errors={deleteErrors}
                    onClose={clearDeleteErrors}
                    style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, maxWidth: 400 }}
                />
            )}
        </>
    );
}
