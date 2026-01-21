import {
  Table,
  Text,
  ActionIcon,
  Group,
  Tooltip,
  Badge,
  Center,
  Anchor,
} from "@mantine/core";
import { Edit } from "lucide-react";
import type { EnrolledStudentResponse } from "@/features/courses/get-enrolled-students/types";

interface EnrolledStudentsTableProps {
  students: EnrolledStudentResponse[];
  onAssignGrade?: (student: EnrolledStudentResponse) => void;
  canAssignGrade?: boolean;
}

export function EnrolledStudentsTable({
  students,
  onAssignGrade,
  canAssignGrade,
}: EnrolledStudentsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatGrade = (grade?: number) => {
    if (grade === undefined || grade === null) {
      return (
        <Text size="sm" c="dimmed" fs="italic">
          Fără notă
        </Text>
      );
    }
    return (
      <Badge
        variant="light"
        color={grade >= 5 ? "green" : "red"}
        size="md"
        radius="sm"
      >
        {grade.toFixed(2)}
      </Badge>
    );
  };

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table
        verticalSpacing="md"
        horizontalSpacing="md"
        withTableBorder
        highlightOnHover
      >
        <Table.Thead bg="gray.0">
          <Table.Tr>
            <Table.Th style={{ width: 140 }}>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Cod Student
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Nume
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Email
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Data Înscrierii
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Notă
              </Text>
            </Table.Th>
            {canAssignGrade && (
              <Table.Th style={{ width: 80 }}>
                <Center>
                  <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                    Acțiuni
                  </Text>
                </Center>
              </Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {students.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={canAssignGrade ? 6 : 5}>
                <Text ta="center" c="dimmed" py="xl">
                  Nu există studenți înregistrați
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            students.map((student) => (
              <Table.Tr key={student.studentId}>
                <Table.Td>
                  <Badge
                    variant="light"
                    color="gray"
                    size="md"
                    radius="sm"
                    styles={{
                      root: {
                        textTransform: "none",
                        fontFamily: "monospace",
                        overflow: "visible",
                      },
                    }}
                  >
                    {student.studentCode}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {student.fullName}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Anchor
                    href={`mailto:${student.email}`}
                    size="sm"
                    c="violet"
                    td="underline"
                  >
                    {student.email}
                  </Anchor>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">
                    {formatDate(student.enrollmentDate)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {formatGrade(student.grade)}
                    {student.assignedByProfessor && (
                      <Tooltip
                        label={`Atribuită de: ${student.assignedByProfessor}`}
                      >
                        <Text size="xs" c="dimmed">
                          (
                          {student.assignedByProfessor
                            .split(" ")
                            .map((n) => n[0])
                            .join(".")}
                          )
                        </Text>
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>
                {canAssignGrade && (
                  <Table.Td>
                    <Group gap={4} justify="center" wrap="nowrap">
                      <Tooltip
                        label={student.grade ? "Modifică nota" : "Adaugă notă"}
                      >
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          size="sm"
                          onClick={() => onAssignGrade?.(student)}
                          aria-label="Adaugă/Modifică notă"
                        >
                          <Edit size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                )}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
