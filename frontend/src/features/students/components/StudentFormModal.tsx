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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useCreateStudent } from "@/features/students/create/useCreateStudent";
import { useUpdateStudent } from "@/features/students/update/useUpdateStudent";
import { useStudentDetails } from "@/features/students/get-details/useStudentDetails";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { validators } from "@/features/_common/utils/validators";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";
import type { CreateStudentRequest } from "@/features/students/create/types";
import type { UpdateStudentRequest } from "@/features/students/update/types";

interface StudentFormModalProps {
  opened: boolean;
  studentId?: number | null;
  onClose: () => void;
}

export function StudentFormModal({
  opened,
  studentId,
  onClose,
}: StudentFormModalProps) {
  const navigate = useNavigate();
  const isEditMode = !!studentId;

  const errorAlertRef = useRef<HTMLDivElement | null>(null);

  // Mutations
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent(studentId || 0);

  // Fetch student details if editing
  const {
    data: student,
    isLoading: isLoadingStudent,
    isError: isStudentError,
  } = useStudentDetails(studentId || 0);

  const { errors, handleError, clearErrors } = useErrorHandler({
    overrides: {
      409: "Un student cu acest CNP sau email există deja în sistem.",
      404: "Studentul nu a fost găsit.",
    },
  });

  const form = useForm<CreateStudentRequest | UpdateStudentRequest>({
    initialValues: {
      cnp: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phoneNumber: "",
      address: {
        address1: "",
        address2: "",
        city: "",
        county: "",
        country: "România",
        postalCode: "",
      },
    },
    validate: {
      cnp: validators.cnp,
      firstName: (value) => validators.name(value, "Prenumele"),
      lastName: (value) => validators.name(value, "Numele de familie"),
      dateOfBirth: (value) => {
        if (!value) return "Data nașterii este obligatorie";
        return validators.dateOfBirth(value);
      },
      email: validators.email,
      phoneNumber: validators.phoneNumber,
      address: {
        address1: (value: string) =>
          validators.required(value, "Adresa este obligatorie"),
        city: (value: string) =>
          validators.required(value, "Orașul este obligatoriu"),
        country: (value: string) =>
          validators.required(value, "Țara este obligatorie"),
        postalCode: validators.postalCode,
      },
    },
  });

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

  // Populate form when student data is loaded (edit mode)
  useEffect(() => {
    if (student && opened && isEditMode) {
      const address = student.address;
      const firstName = student.fullName.split(" ")[0];
      const lastName = student.fullName.split(" ")[1];

      form.setValues({
        cnp: student.cnp,
        firstName,
        lastName,
        dateOfBirth: student.dateOfBirth,
        email: student.email,
        phoneNumber: student.phoneNumber,
        address: address
          ? {
              address1: address.address1,
              address2: address.address2 || "",
              city: address.city,
              county: address.county || "",
              country: address.country,
              postalCode: address.postalCode || "",
            }
          : {
              address1: "",
              address2: "",
              city: "",
              county: "",
              country: "România",
              postalCode: "",
            },
      });
    }
  }, [student, opened, isEditMode]);

  const handleSubmit = async (
    values: CreateStudentRequest | UpdateStudentRequest,
  ) => {
    clearErrors();

    try {
      if (isEditMode) {
        await updateStudentMutation.mutateAsync(values as UpdateStudentRequest);
      } else {
        await createStudentMutation.mutateAsync(values as CreateStudentRequest);
      }

      // Success - close modal and reset form
      form.reset();
      clearErrors();
      onClose();

      if (isEditMode) {
        navigate({ to: `/students/${studentId}` });
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
    ? updateStudentMutation.isPending
    : createStudentMutation.isPending;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text size="xl" fw={700}>
          {isEditMode ? "Editare Student" : "Adaugare Student"}
        </Text>
      }
      size="xl"
      centered
    >
      {isEditMode && isLoadingStudent ? (
        <Center p="xl">
          <Loader size="lg" />
        </Center>
      ) : isEditMode && isStudentError ? (
        <Center p="xl">
          <Text c="red">Eroare la încărcarea datelor studentului.</Text>
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

            {/* Personal Information Section */}
            <div>
              <Title order={5} mb="md" c="dimmed">
                Informații Personale
              </Title>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Prenume"
                    required
                    {...form.getInputProps("firstName")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Nume de familie"
                    required
                    {...form.getInputProps("lastName")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="CNP"
                    required
                    maxLength={13}
                    {...form.getInputProps("cnp")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="Data nașterii"
                    placeholder="Selectează data"
                    required
                    valueFormat="DD/MM/YYYY"
                    maxDate={new Date()}
                    {...form.getInputProps("dateOfBirth")}
                  />
                </Grid.Col>
              </Grid>
            </div>

            {/* Contact Information Section */}
            <div>
              <Title order={5} mb="md" c="dimmed">
                Informații de Contact
              </Title>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Email"
                    required
                    type="email"
                    {...form.getInputProps("email")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Număr de telefon"
                    required
                    {...form.getInputProps("phoneNumber")}
                  />
                </Grid.Col>
              </Grid>
            </div>

            {/* Address Section */}
            <div>
              <Title order={5} mb="md" c="dimmed">
                Adresă
              </Title>

              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    label="Adresa (Linia 1)"
                    placeholder="Str. Exemplu, Nr. 142"
                    required
                    {...form.getInputProps("address.address1")}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <TextInput
                    label="Adresa (Linia 2)"
                    placeholder="Bloc A, Scara 1, Ap. 5 (opțional)"
                    {...form.getInputProps("address.address2")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Oraș"
                    required
                    {...form.getInputProps("address.city")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Județ"
                    {...form.getInputProps("address.county")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Țară"
                    placeholder="România"
                    required
                    {...form.getInputProps("address.country")}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Cod poștal"
                    maxLength={10}
                    {...form.getInputProps("address.postalCode")}
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
                {isEditMode ? "Salvează Modificările" : "Adaugă Student"}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
