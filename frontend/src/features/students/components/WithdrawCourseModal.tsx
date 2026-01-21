import { Modal, Button, Group, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useWithdrawStudent } from "@/features/courses/withdraw/useWithdrawStudent";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import { useErrorHandler } from "@/features/_common/hooks/useErrorHandler";

interface WithdrawCourseModalProps {
  opened: boolean;
  studentId: number;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  onClose: () => void;
}

export function WithdrawCourseModal({
  opened,
  studentId,
  studentName,
  courseId,
  courseCode,
  courseName,
  onClose,
}: WithdrawCourseModalProps) {
  const { errors, handleError, clearErrors } = useErrorHandler({});
  const withdrawMutation = useWithdrawStudent();

  const handleWithdraw = async () => {
    clearErrors();

    try {
      await withdrawMutation.mutateAsync({
        courseId,
        studentId,
      });

      notifications.show({
        title: "Succes",
        message: `${studentName} a renunțat la cursul ${courseName}!`,
        color: "green",
      });

      onClose();
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleClose = () => {
    clearErrors();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Confirmare Renunțare la Curs"
      size="md"
    >
      <Stack gap="md">
        {errors && <ErrorAlert errors={errors} onClose={clearErrors} />}

        <Text size="sm">
          Ești sigur că vrei să scoți studentul <strong>{studentName}</strong>{" "}
          de la cursul{" "}
          <strong>
            {courseCode} - {courseName}
          </strong>
          ?
        </Text>

        <Group justify="flex-end" mt="md">
          <Button
            variant="subtle"
            onClick={handleClose}
            disabled={withdrawMutation.isPending}
          >
            Anulează
          </Button>
          <Button
            color="red"
            onClick={handleWithdraw}
            loading={withdrawMutation.isPending}
          >
            Renunță la Curs
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
