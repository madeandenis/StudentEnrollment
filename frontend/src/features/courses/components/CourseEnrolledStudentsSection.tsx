import {
  Paper,
  Title,
  Stack,
  Text,
  Group,
  Loader,
  Center,
} from "@mantine/core";
import { GraduationCap } from "lucide-react";
import { useCourseEnrolledStudents } from "@/features/courses/get-enrolled-students/useCourseEnrolledStudents";
import { useModalState } from "@/features/_common/hooks/useModalState";
import { AssignGradeModal } from "@/features/students/components/AssignGradeModal";
import { EnrolledStudentsTable } from "./EnrolledStudentsTable";
import ErrorAlert from "@/features/_common/components/ErrorAlert";
import type { EnrolledStudentResponse } from "@/features/courses/get-enrolled-students/types";
import { useAuth } from "@/features/auth/_contexts/AuthContext";

interface CourseEnrolledStudentsSectionProps {
  courseId: number;
  courseName: string;
  professorId?: number;
}

export function CourseEnrolledStudentsSection({
  courseId,
  courseName,
  professorId,
}: CourseEnrolledStudentsSectionProps) {
  const { user, isAdmin } = useAuth();
  const isProfessor = !!user?.professorCode;
  const canAssignGrade = isAdmin || (isProfessor && !!professorId); // Professors can only assign grades to their own courses

  // Only admins and professors can view the enrolled students list
  const canViewStudents = isAdmin || isProfessor;

  const { data, isLoading, isError, error } =
    useCourseEnrolledStudents(courseId);
  const gradeModal = useModalState<EnrolledStudentResponse>();

  const handleGradeClick = (student: EnrolledStudentResponse) => {
    gradeModal.open(student);
  };

  // Students cannot view the enrolled students section
  if (!canViewStudents) {
    return null;
  }

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
          errors={error?.message || "Nu s-a putut încărca studenții înscriși"}
          onReload
        />
      </Paper>
    );
  }

  const enrolledStudents = data?.enrolledStudents || [];
  const totalStudents = data?.totalEnrolledStudents || 0;

  return (
    <>
      <Paper p="md" shadow="sm" withBorder>
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <Group>
              <GraduationCap size={24} strokeWidth={1.5} />
              <div>
                <Title order={4}>Studenți Înscriși</Title>
                <Text size="sm" c="dimmed">
                  Total: <strong>{totalStudents}</strong>{" "}
                  {totalStudents === 1 ? "student" : "studenți"}
                </Text>
              </div>
            </Group>
          </Group>

          {/* Students Table */}
          {enrolledStudents.length === 0 ? (
            <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
              Niciun student înscris la acest curs.
            </Text>
          ) : (
            <EnrolledStudentsTable
              students={enrolledStudents}
              onAssignGrade={handleGradeClick}
              canAssignGrade={canAssignGrade}
            />
          )}
        </Stack>
      </Paper>

      {/* Grade Assignment Modal */}
      {canAssignGrade && gradeModal.opened && gradeModal.item && (
        <AssignGradeModal
          opened={gradeModal.opened}
          onClose={gradeModal.close}
          courseId={courseId}
          studentId={gradeModal.item.studentId}
          courseName={courseName}
          currentGrade={gradeModal.item.grade}
        />
      )}
    </>
  );
}
