import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Paper,
  Title,
  Group,
  Button,
  Stack,
  Loader,
  Center,
  Grid,
  Text,
  Badge,
  Divider,
  ActionIcon,
  Tooltip,
  Box,
} from "@mantine/core";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
} from "lucide-react";
import { useStudentDetails } from "@/features/students/get-details/useStudentDetails";
import { useDeleteStudent } from "@/features/students/delete/useDeleteStudent";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";
import { useModalState } from "@/features/_common/hooks/useModalState";
import { ConfirmModal } from "../_common/components/ConfirmModal";
import { StudentFormModal } from "@/features/students/components/StudentFormModal";
import { StudentEnrolledCoursesSection } from "@/features/students/components/StudentEnrolledCoursesSection";
import { useAuth } from "@/features/auth/_contexts/AuthContext";

export function StudentDetailsPage() {
  const { isAdmin } = useAuth();
  const { id } = useParams({ from: "/protected/students/$id" });
  const navigate = useNavigate();
  const studentId = parseInt(id);

  const formModal = useModalState();
  const deleteModal = useModalState<{ id: number; name: string }>();

  // Fetch student details
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useStudentDetails(studentId);

  // Error handling for deletion
  const {
    errors: deleteErrors,
    handleError: handleDeleteError,
    clearErrors: clearDeleteErrors,
  } = useErrorHandler({});

  // Handlers
  const handleBack = () => {
    navigate({ to: "/students" });
  };

  const handleEdit = () => {
    formModal.open();
  };

  const handleDeleteClick = () => {
    if (student) {
      deleteModal.open({ id: student.id, name: student.fullName });
    }
  };

  const deleteStudentMutation = useDeleteStudent();
  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    try {
      await deleteStudentMutation.mutateAsync(deleteModal.item.id);
      deleteModal.close();
      clearDeleteErrors();
      navigate({ to: "/students" });
    } catch (error: any) {
      handleDeleteError(error);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  // Error state
  if (isError || !student) {
    return (
      <Paper p="md" shadow="sm" withBorder>
        <ErrorAlert
          errors={error?.message || "Nu s-a putut încărca datele studentului"}
          onClose={() => {}}
        />
        <Button
          mt="md"
          onClick={handleBack}
          leftSection={<ArrowLeft size={18} />}
        >
          Înapoi la listă
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Paper p="md" shadow="sm" withBorder>
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <Group>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={handleBack}
                aria-label="Înapoi"
              >
                <ArrowLeft size={20} />
              </ActionIcon>
              <div>
                <Title order={2}>{student.fullName}</Title>
                <Group gap="xs" mt={4}>
                  <Badge variant="light" color="blue">
                    {student.studentCode}
                  </Badge>
                  <Text size="sm" c="dimmed">
                    Student
                  </Text>
                </Group>
              </div>
            </Group>

            {isAdmin && (
              <Group>
                <Tooltip label="Editează">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    size="lg"
                    onClick={handleEdit}
                    aria-label="Editează student"
                  >
                    <Edit size={18} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Șterge">
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="lg"
                    onClick={handleDeleteClick}
                    aria-label="Șterge student"
                  >
                    <Trash2 size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>

          <Divider />

          {/* Student Information */}
          <div>
            <Title order={4} mb="md">
              Informații Personale
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="xs" mb="sm">
                  <Hash
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: "var(--mantine-color-dimmed)" }}
                  />
                  <div>
                    <Text size="xs" c="dimmed">
                      CNP
                    </Text>
                    <Text size="sm" fw={500}>
                      {student.cnp}
                    </Text>
                  </div>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="xs" mb="sm">
                  <Calendar
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: "var(--mantine-color-dimmed)" }}
                  />
                  <div>
                    <Text size="xs" c="dimmed">
                      Data Nașterii
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatDate(student.dateOfBirth)}
                    </Text>
                  </div>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="xs" mb="sm">
                  <Mail
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: "var(--mantine-color-dimmed)" }}
                  />
                  <div>
                    <Text size="xs" c="dimmed">
                      Email
                    </Text>
                    <Text size="sm" fw={500}>
                      {student.email}
                    </Text>
                  </div>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="xs" mb="sm">
                  <Phone
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: "var(--mantine-color-dimmed)" }}
                  />
                  <div>
                    <Text size="xs" c="dimmed">
                      Telefon
                    </Text>
                    <Text size="sm" fw={500}>
                      {student.phoneNumber}
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          {/* Address Information */}
          <div>
            <Title order={4} mb="md">
              Adresă
            </Title>
            {student.address ? (
              <Group gap="xs">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                  style={{ color: "var(--mantine-color-dimmed)" }}
                />
                <div>
                  <Text size="sm" fw={500}>
                    {student.address.address1}
                    {student.address.address2 &&
                      `, ${student.address.address2}`}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {student.address.city}
                    {student.address.county && `, ${student.address.county}`}
                    {student.address.postalCode &&
                      `, ${student.address.postalCode}`}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {student.address.country}
                  </Text>
                </div>
              </Group>
            ) : (
              <Text size="sm" c="dimmed" fs="italic">
                Adresă nedefinită
              </Text>
            )}
          </div>

          <Divider />

          {/* Metadata */}
          <div>
            <Text size="xs" c="dimmed">
              Creat la: {formatDate(student.createdAt)}
            </Text>
          </div>
        </Stack>
      </Paper>

      <Box mt="md">
        {/* Enrolled Courses Section */}
        <StudentEnrolledCoursesSection
          studentId={studentId}
          studentName={student.fullName}
        />
      </Box>

      {/* Edit Modal */}
      <StudentFormModal
        opened={formModal.opened}
        studentId={studentId}
        onClose={formModal.close}
      />

      {/* Delete Confirmation Modal */}
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

      {/* Delete Error Alert */}
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
