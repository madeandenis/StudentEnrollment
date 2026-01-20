import { useCallback } from "react";
import {
  Button,
  Paper,
  Title,
  Group,
  Text,
  Stack,
  Loader,
  Center,
  Divider,
} from "@mantine/core";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ProfessorFormModal } from "@/features/professors/components/ProfessorFormModal";
import { ProfessorsTable } from "@/features/professors/components/ProfessorsTable";
import { useProfessorList } from "@/features/professors/get-list/useProfessorList";
import { useDeleteProfessor } from "@/features/professors/delete/useDeleteProfessor";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";
import { useTableState } from "@/features/_common/hooks/useTableState";
import { Pagination } from "../_common/components/Pagination";
import { useModalState } from "@/features/_common/hooks/useModalState";
import { ConfirmModal } from "../_common/components/ConfirmModal";
import { SearchBar } from "../_common/components/SearchBar";
import { AssignProfessorToCourseModal } from "./components/AssignProfessorToCourseModal";
import { useAuth } from "@/features/auth/_contexts/AuthContext";
import type { ProfessorResponse } from "@/features/professors/_common/types";

export function ProfessorsPage() {
  const navigate = useNavigate();

  const formModal = useModalState<{ professorId?: number }>();
  const deleteModal = useModalState<{ id: number; name: string }>();
  const assignModal = useModalState<ProfessorResponse>();
  const { isAdmin } = useAuth();

  const table = useTableState({
    initialPageSize: 10,
    initialFilters: {
      search: "",
      sortBy: "FullName",
      sortOrder: "asc",
    },
  });

  // Fetch professors
  const { data, isLoading, isError, error } = useProfessorList({
    PageIndex: table.pageIndex,
    PageSize: table.pageSize,
    Search: table.filters.search || undefined,
    SortBy: table.filters.sortBy,
    SortOrder: table.filters.sortOrder,
  });

  // Errors
  const {
    errors: deleteErrors,
    handleError: handleDeleteError,
    clearErrors: clearDeleteErrors,
  } = useErrorHandler({});

  // Handlers
  const handleView = useCallback(
    (id: number) => {
      navigate({ to: `/professors/${id}` });
    },
    [navigate],
  );

  const handleCreate = useCallback(() => formModal.open(), [formModal]);

  const handleEdit = useCallback(
    (id: number) => {
      formModal.open({ professorId: id });
    },
    [formModal],
  );

  const handleDeleteClick = (professor: { id: number; fullName: string }) => {
    deleteModal.open({ id: professor.id, name: professor.fullName });
  };

  const handleAssign = useCallback(
    (professor: ProfessorResponse) => {
      assignModal.open(professor);
    },
    [assignModal],
  );

  const deleteProfessorMutation = useDeleteProfessor();
  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    try {
      await deleteProfessorMutation.mutateAsync(deleteModal.item.id);
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
            <Title order={2} c="dark.4">Profesori</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Gestionează profesorii înregistrați în sistem
            </Text>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            onClick={handleCreate}
            variant="filled"
            color="blue"
            size="sm"
          >
            Adaugă Profesor
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
                errors={
                  error?.message || "A apărut o eroare la încărcarea profesorilor"
                }
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
                <ProfessorsTable
                  professors={data.items}
                  sortBy={table.filters.sortBy}
                  sortOrder={table.filters.sortOrder}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onAssign={handleAssign}
                  onSort={table.setSort}
                  isAdmin={isAdmin}
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
                  itemLabel="profesori"
                />
              </>
            )}
          </Stack>
        </Paper>
      </Stack>

      {/* Modals */}
      <ProfessorFormModal
        opened={formModal.opened}
        professorId={formModal.item?.professorId}
        onClose={formModal.close}
      />

      {deleteModal.opened && deleteModal.item && (
        <ConfirmModal
          opened={deleteModal.opened}
          item={deleteModal.item.name}
          confirmLabel="Șterge Profesor"
          title="Confirmare ștergere"
          description={(name) =>
            `Ești sigur că vrei să ștergi profesorul ${name}? Această acțiune nu poate fi anulată.`
          }
          isLoading={deleteProfessorMutation.isPending}
          onClose={deleteModal.close}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Delete Error Alert in Modal */}
      {deleteErrors && deleteModal.opened && (
        <ErrorAlert
          errors={deleteErrors}
          onClose={clearDeleteErrors}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 400,
          }}
        />
      )}
      {/* Assign Modal */}
      {isAdmin && assignModal.opened && assignModal.item && (
        <AssignProfessorToCourseModal
          opened={assignModal.opened}
          professorId={assignModal.item.id}
          professorName={assignModal.item.fullName}
          professorCode={assignModal.item.professorCode}
          onClose={assignModal.close}
        />
      )}
    </>
  );
}
