import {
  Modal,
  TextInput,
  Button,
  Stack,
  Grid,
  Group,
  Title,
  Loader,
  Center,
  Text,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useCreateCourse } from "@/features/courses/create/useCreateCourse";
import { useUpdateCourse } from "@/features/courses/update/useUpdateCourse";
import { useCourseDetails } from "@/features/courses/get-details/useCourseDetails";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { validators } from "@/features/_common/utils/validators";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";
import type { CreateCourseRequest } from "@/features/courses/create/types";
import type { UpdateCourseRequest } from "@/features/courses/update/types";

interface CourseFormModalProps {
  opened: boolean;
  courseId?: number | null;
  onClose: () => void;
}

export function CourseFormModal({
  opened,
  courseId,
  onClose,
}: CourseFormModalProps) {
  const navigate = useNavigate();
  const isEditMode = !!courseId;

  const errorAlertRef = useRef<HTMLDivElement | null>(null);

  // Mutations
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse(courseId || 0);

  // Fetch course details if editing
  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isCourseError,
  } = useCourseDetails(courseId || 0);

  const { errors, handleError, clearErrors } = useErrorHandler({
    overrides: {
      409: "Un curs cu acest cod există deja în sistem.",
      404: "Cursul nu a fost găsit.",
    },
  });

  const form = useForm<CreateCourseRequest | UpdateCourseRequest>({
    initialValues: {
      courseCode: "",
      name: "",
      description: "",
      credits: 0,
      maxEnrollment: 0,
    },
    validate: {
      courseCode: validators.courseCode,
      name: validators.courseName,
      description: validators.courseDescription,
      credits: validators.credits,
      maxEnrollment: (value) => {
        const baseError = validators.maxEnrollment(value);
        if (baseError) return baseError;

        if (isEditMode && course && value < course.enrolledStudents) {
          return `Capacitatea nu poate fi mai mică decât numărul de studenți înscriși (${course.enrolledStudents}).`;
        }

        return null;
      },
    },
  });

  // Populate form when course data is loaded (edit mode)
  useEffect(() => {
    if (course && opened && isEditMode) {
      form.setValues({
        courseCode: course.courseCode,
        name: course.name,
        description: course.description,
        credits: course.credits,
        maxEnrollment: course.maxEnrollment,
      });
    }
  }, [course, opened, isEditMode]);

  useEffect(() => {
    if (errors) {
      setTimeout(() => {
        errorAlertRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [errors]);

  const handleSubmit = async (
    values: CreateCourseRequest | UpdateCourseRequest,
  ) => {
    clearErrors();

    try {
      if (isEditMode) {
        await updateCourseMutation.mutateAsync(values as UpdateCourseRequest);
      } else {
        await createCourseMutation.mutateAsync(values as CreateCourseRequest);
      }

      // Success - close modal and reset form
      form.reset();
      clearErrors();
      onClose();

      if (isEditMode) {
        navigate({ to: `/courses/${courseId}` });
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleClose = () => {
    form.reset();
    clearErrors();
    onClose();
  };

  const isPending = isEditMode
    ? updateCourseMutation.isPending
    : createCourseMutation.isPending;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text size="xl" fw={700}>
          {isEditMode ? "Editare Curs" : "Adăugare Curs"}
        </Text>
      }
      size="lg"
      centered
    >
      {isEditMode && isLoadingCourse ? (
        <Center p="xl">
          <Loader size="lg" />
        </Center>
      ) : isEditMode && isCourseError ? (
        <Center p="xl">
          <Text c="red">Eroare la încărcarea datelor cursului.</Text>
        </Center>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {errors && (
              <ErrorAlert
                ref={errorAlertRef}
                errors={errors}
                onClose={clearErrors}
              />
            )}

            {/* Course Information Section */}
            <div>
              <Title order={5} mb="md" c="dimmed">
                Informații Curs
              </Title>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Cod Curs"
                    required
                    placeholder="ex: CS101"
                    maxLength={20}
                    {...form.getInputProps("courseCode")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Nume Curs"
                    required
                    placeholder="ex: Introducere în Programare"
                    maxLength={150}
                    {...form.getInputProps("name")}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Textarea
                    label="Descriere"
                    required
                    placeholder="Descrieți conținutul cursului..."
                    minRows={4}
                    maxRows={8}
                    maxLength={500}
                    {...form.getInputProps("description")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <NumberInput
                    label="Credite"
                    required
                    min={1}
                    max={10}
                    {...form.getInputProps("credits")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <NumberInput
                    label="Număr Maxim de Studenți"
                    required
                    min={1}
                    max={1000}
                    {...form.getInputProps("maxEnrollment")}
                  />
                </Grid.Col>
              </Grid>
            </div>

            {/* Form Actions */}
            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={handleClose}
                disabled={isPending}
              >
                Anulează
              </Button>
              <Button type="submit" loading={isPending}>
                {isEditMode ? "Salvează Modificările" : "Adaugă Curs"}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
