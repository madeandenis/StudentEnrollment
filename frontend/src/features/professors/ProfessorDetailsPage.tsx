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
  Anchor,
} from "@mantine/core";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { useProfessorDetails } from "@/features/professors/get-details/useProfessorDetails";
import { useDeleteProfessor } from "@/features/professors/delete/useDeleteProfessor";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";
import { useModalState } from "@/features/_common/hooks/useModalState";
import { ConfirmModal } from "../_common/components/ConfirmModal";
import { ProfessorFormModal } from "@/features/professors/components/ProfessorFormModal";
import { ProfessorAssignedCoursesSection } from "@/features/professors/components/ProfessorAssignedCoursesSection";
import { useAuth } from "@/features/auth/_contexts/AuthContext";

export function ProfessorDetailsPage() {
  const { isAdmin } = useAuth();
  const { id } = useParams({ from: "/protected/professors/$id" });
  const navigate = useNavigate();
  const professorId = parseInt(id);

  const formModal = useModalState();
  const deleteModal = useModalState<{ id: number; name: string }>();

  // Fetch professor details
  const {
    data: professor,
    isLoading,
    isError,
    error,
  } = useProfessorDetails(professorId);

  // Error handling for deletion
  const {
    errors: deleteErrors,
    handleError: handleDeleteError,
    clearErrors: clearDeleteErrors,
  } = useErrorHandler({});

  // Handlers
  const handleBack = () => {
    navigate({ to: "/professors" });
  };

  const handleEdit = () => {
    formModal.open();
  };

  const handleDeleteClick = () => {
    if (professor) {
      deleteModal.open({ id: professor.id, name: professor.fullName });
    }
  };

  const deleteProfessorMutation = useDeleteProfessor();
  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    try {
      await deleteProfessorMutation.mutateAsync(deleteModal.item.id);
      deleteModal.close();
      clearDeleteErrors();
      navigate({ to: "/professors" });
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
  if (isError || !professor) {
    return (
      <Paper p="md" shadow="sm" withBorder>
        <ErrorAlert
          errors={error?.message || "Nu s-a putut încărca datele profesorului"}
          onReload
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
                <Title order={2}>{professor.fullName}</Title>
                <Group gap="xs" mt={4}>
                  <Badge variant="light" color="blue">
                    {professor.professorCode}
                  </Badge>
                  <Text size="sm" c="dimmed">
                    Profesor
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
                    aria-label="Editează profesor"
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
                    aria-label="Șterge profesor"
                  >
                    <Trash2 size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>

          <Divider />

          {/* Professor Information */}
          <div>
            <Title order={4} mb="md">
              Informații Personale
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="xs" mb="sm">
                  <User
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: "var(--mantine-color-dimmed)" }}
                  />
                  <div>
                    <Text size="xs" c="dimmed">
                      ID Utilizator
                    </Text>
                    <Text size="sm" fw={500}>
                      {professor.userId}
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
                    <Anchor
                      href={`mailto:${professor.email}`}
                      size="sm"
                      c="violet"
                      td="underline"
                      fw={500}
                    >
                      {professor.email}
                    </Anchor>
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
                      {professor.phoneNumber}
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
                      Data Înregistrării
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatDate(professor.createdAt)}
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
            {professor.address ? (
              <Group gap="xs">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                  style={{ color: "var(--mantine-color-dimmed)" }}
                />
                <div>
                  <Text size="sm" fw={500}>
                    {professor.address.address1}
                    {professor.address.address2 &&
                      `, ${professor.address.address2}`}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {professor.address.city}
                    {professor.address.county &&
                      `, ${professor.address.county}`}
                    {professor.address.postalCode &&
                      `, ${professor.address.postalCode}`}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {professor.address.country}
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
              Creat la: {formatDate(professor.createdAt)}
            </Text>
          </div>
        </Stack>
      </Paper>

      <Box mt="md">
        {/* Assigned Courses Section */}
        <ProfessorAssignedCoursesSection
          professorId={professorId}
          professorName={professor.fullName}
          professorCode={professor.professorCode}
        />
      </Box>

      {/* Edit Modal */}
      <ProfessorFormModal
        opened={formModal.opened}
        professorId={professorId}
        onClose={formModal.close}
      />

      {/* Delete Confirmation Modal */}
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
