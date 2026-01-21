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
import { CourseFormModal } from "@/features/courses/components/CourseFormModal";
import { CoursesTable } from "@/features/courses/components/CoursesTable";
import { useCourseList } from "@/features/courses/get-list/useCourseList";
import { useDeleteCourse } from "@/features/courses/delete/useDeleteCourse";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";
import { useTableState } from "@/features/_common/hooks/useTableState";
import { Pagination } from "../_common/components/Pagination";
import { useModalState } from "@/features/_common/hooks/useModalState";
import { ConfirmModal } from "../_common/components/ConfirmModal";
import { SearchBar } from "../_common/components/SearchBar";

import { useAuth } from "@/features/auth/_contexts/AuthContext";

export function CoursesPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const formModal = useModalState<{ courseId?: number }>();
  const deleteModal = useModalState<{ id: number; name: string }>();

  const table = useTableState({
    initialPageSize: 10,
    initialFilters: {
      search: "",
      sortBy: "Name",
      sortOrder: "asc",
    },
  });

  // Fetch courses
  const { data, isLoading, isError, error } = useCourseList({
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
      navigate({ to: `/courses/${id}` });
    },
    [navigate],
  );

  const handleCreate = useCallback(() => formModal.open(), [formModal]);

  const handleEdit = useCallback(
    (id: number) => {
      formModal.open({ courseId: id });
    },
    [formModal],
  );

  const handleDeleteClick = (course: { id: number; name: string }) => {
    deleteModal.open({ id: course.id, name: course.name });
  };

  const deleteCourseMutation = useDeleteCourse();
  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    try {
      await deleteCourseMutation.mutateAsync(deleteModal.item.id);
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
            <Title order={2} c="dark.4">
              Cursuri
            </Title>
            <Text c="dimmed" size="sm" mt={4}>
              Gestionează cursurile disponibile în sistem
            </Text>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            onClick={handleCreate}
            variant="filled"
            color="blue"
            size="sm"
          >
            Adaugă Curs
          </Button>
        </Group>

        {/* Content Card */}
        <Paper p="lg" shadow="xs" withBorder bg="white" radius="md">
          <Stack gap="lg">
            {/* Search Bar */}
            <SearchBar
              onSearch={table.setSearch}
              placeholder="Caută după nume sau cod curs..."
            />

            {/* Error Display */}
            {isError && (
              <ErrorAlert
                errors={
                  error?.message || "A apărut o eroare la încărcarea cursurilor"
                }
                onReload
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
                <CoursesTable
                  courses={data.items}
                  sortBy={table.filters.sortBy}
                  sortOrder={table.filters.sortOrder}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
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
                  itemLabel="cursuri"
                />
              </>
            )}
          </Stack>
        </Paper>
      </Stack>

      {/* Modals */}
      <CourseFormModal
        opened={formModal.opened}
        courseId={formModal.item?.courseId}
        onClose={formModal.close}
      />

      {deleteModal.opened && deleteModal.item && (
        <ConfirmModal
          opened={deleteModal.opened}
          item={deleteModal.item.name}
          confirmLabel="Șterge Curs"
          title="Confirmare ștergere"
          description={(name) =>
            `Ești sigur că vrei să ștergi cursul ${name}? Această acțiune nu poate fi anulată.`
          }
          isLoading={deleteCourseMutation.isPending}
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
    </>
  );
}
