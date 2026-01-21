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
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useCreateProfessor } from "@/features/professors/create/useCreateProfessor";
import { useUpdateProfessor } from "@/features/professors/update/useUpdateProfessor";
import { useProfessorDetails } from "@/features/professors/get-details/useProfessorDetails";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { validators } from "@/features/_common/utils/validators";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";
import { UserSearchSelect } from "@/features/_common/components/UserSearchSelect";
import type { CreateProfessorRequest } from "@/features/professors/create/types";
import type { UpdateProfessorRequest } from "@/features/professors/update/types";

interface ProfessorFormModalProps {
  opened: boolean;
  professorId?: number | null;
  onClose: () => void;
}

export function ProfessorFormModal({
  opened,
  professorId,
  onClose,
}: ProfessorFormModalProps) {
  const navigate = useNavigate();
  const isEditMode = !!professorId;

  const errorAlertRef = useRef<HTMLDivElement | null>(null);

  // Mutations
  const createProfessorMutation = useCreateProfessor();
  const updateProfessorMutation = useUpdateProfessor();

  // Fetch professor details if editing
  const {
    data: professor,
    isLoading: isLoadingProfessor,
    isError: isProfessorError,
  } = useProfessorDetails(professorId || 0);

  const { errors, handleError, clearErrors } = useErrorHandler({
    overrides: {
      409: "Un profesor cu acest email există deja în sistem sau utilizatorul este deja asociat unui profesor.",
      404: "Profesorul nu a fost găsit.",
    },
  });

  const form = useForm<CreateProfessorRequest | UpdateProfessorRequest>({
    initialValues: {
      userId: 0,
      firstName: "",
      lastName: "",
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
      userId: (value) => {
        if (!value || value <= 0)
          return "ID-ul utilizatorului este obligatoriu";
        return null;
      },
      firstName: (value) => validators.name(value, "Prenumele"),
      lastName: (value) => validators.name(value, "Numele de familie"),
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

  // Populate form when professor data is loaded (edit mode)
  useEffect(() => {
    if (professor && opened && isEditMode) {
      const address = professor.address;
      const nameParts = professor.fullName.split(" ");
      const lastName = nameParts.pop() || "";
      const firstName = nameParts.join(" ");

      form.setValues({
        userId: professor.userId,
        firstName,
        lastName,
        email: professor.email,
        phoneNumber: professor.phoneNumber,
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
  }, [professor, opened, isEditMode]);

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
    values: CreateProfessorRequest | UpdateProfessorRequest,
  ) => {
    clearErrors();

    try {
      if (isEditMode) {
        await updateProfessorMutation.mutateAsync({
          id: professorId!,
          data: values as UpdateProfessorRequest,
        });
      } else {
        await createProfessorMutation.mutateAsync(
          values as CreateProfessorRequest,
        );
      }

      // Success - close modal and reset form
      form.reset();
      clearErrors();
      onClose();

      if (isEditMode) {
        navigate({ to: `/professors/${professorId}` });
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
    ? updateProfessorMutation.isPending
    : createProfessorMutation.isPending;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text size="xl" fw={700}>
          {isEditMode ? "Editare Profesor" : "Adăugare Profesor"}
        </Text>
      }
      size="xl"
      centered
    >
      {isEditMode && isLoadingProfessor ? (
        <Center p="xl">
          <Loader size="lg" />
        </Center>
      ) : isEditMode && isProfessorError ? (
        <Center p="xl">
          <Text c="red">Eroare la încărcarea datelor profesorului.</Text>
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

                <Grid.Col span={12}>
                  <UserSearchSelect
                    value={form.values.userId || null}
                    onChange={(userId) =>
                      form.setFieldValue("userId", userId || 0)
                    }
                    error={form.errors.userId as string}
                    label="Utilizator"
                    placeholder="Caută utilizator după email sau nume..."
                    required
                    excludeWithProfessor
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
                {isEditMode ? "Salvează Modificările" : "Adaugă Profesor"}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
