import {
  Paper,
  Title,
  Stack,
  Text,
  Group,
  Button,
  Loader,
  Center,
} from "@mantine/core";
import { GraduationCap, Plus } from "lucide-react";
import { useStudentEnrolledCourses } from "@/features/students/get-enrolled-courses/useStudentEnrolledCourses";
import { useModalState } from "@/features/_common/hooks/useModalState";
import { useNavigate } from "@tanstack/react-router";
import { EnrollStudentModal } from "./EnrollStudentModal";
import { WithdrawCourseModal } from "./WithdrawCourseModal";
import { EnrolledCoursesTable } from "./EnrolledCoursesTable";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import type { EnrolledCourseResponse } from "@/features/students/get-enrolled-courses/types";
import { useAuth } from "@/features/auth/_contexts/AuthContext";

interface StudentEnrolledCoursesSectionProps {
  studentId: number;
  studentName: string;
}

export function StudentEnrolledCoursesSection({
  studentId,
  studentName,
}: StudentEnrolledCoursesSectionProps) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } =
    useStudentEnrolledCourses(studentId);
  const enrollModal = useModalState();
  const withdrawModal = useModalState<EnrolledCourseResponse>();

  const handleWithdrawClick = (course: EnrolledCourseResponse) => {
    withdrawModal.open(course);
  };

  const handleViewCourse = (courseId: number) => {
    navigate({ to: `/courses/${courseId}` });
  };

  if (isLoading) {
    return (
      <Paper p="md" shadow="sm" withBorder>
        <Center py="xl">
          <Loader size="lg" />
        </Center>
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper p="md" shadow="sm" withBorder>
        <ErrorAlert
          errors={
            error?.message || "Nu s-a putut încărca cursurile studentului"
          }
          onReload
        />
      </Paper>
    );
  }

  const enrolledCourses = data?.enrolledCourses || [];
  const totalCredits = data?.totalCreditsAccumulated || 0;

  return (
    <>
      <Paper p="md" shadow="sm" withBorder>
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <Group>
              <GraduationCap size={24} strokeWidth={1.5} />
              <div>
                <Title order={4}>Cursuri Înscrise</Title>
                <Text size="sm" c="dimmed">
                  Total credite acumulate: <strong>{totalCredits}</strong>
                </Text>
              </div>
            </Group>
            {isAdmin && (
              <Button
                leftSection={<Plus size={18} />}
                onClick={() => enrollModal.open()}
              >
                Înscrie la Curs
              </Button>
            )}
          </Group>

          {/* Courses Table */}
          {enrolledCourses.length === 0 ? (
            <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
              Studentul nu este înscris la niciun curs.
            </Text>
          ) : (
            <EnrolledCoursesTable
              courses={enrolledCourses}
              onWithdraw={handleWithdrawClick}
              onViewCourse={handleViewCourse}
              isAdmin={isAdmin}
            />
          )}
        </Stack>
      </Paper>

      {/* Enroll Modal */}
      {isAdmin && (
        <EnrollStudentModal
          opened={enrollModal.opened}
          studentId={studentId}
          studentName={studentName}
          onClose={enrollModal.close}
        />
      )}

      {/* Withdraw Modal */}
      {isAdmin && withdrawModal.opened && withdrawModal.item && (
        <WithdrawCourseModal
          opened={withdrawModal.opened}
          studentId={studentId}
          studentName={studentName}
          courseId={withdrawModal.item.courseId}
          courseCode={withdrawModal.item.code}
          courseName={withdrawModal.item.name}
          onClose={withdrawModal.close}
        />
      )}
    </>
  );
}
