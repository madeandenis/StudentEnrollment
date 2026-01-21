import {
  Table,
  Text,
  ActionIcon,
  Group,
  Tooltip,
  Badge,
  Center,
} from "@mantine/core";
import { Eye, Pencil, Trash2, UserPlus } from "lucide-react";
import type { CourseResponse } from "@/features/courses/_common/types";
import type { AssignedCourseResponse } from "@/features/professors/get-assigned-courses/types";
import { SortableTh } from "@/features/_common/components/SortableTh";
import { useNavigate } from "@tanstack/react-router";

type TableCourse = CourseResponse | AssignedCourseResponse;

interface CoursesTableProps {
  courses: TableCourse[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: ({ id, name }: { id: number; name: string }) => void;
  onSort?: (column: string) => void;
  isProfessor?: boolean;
  isAdmin?: boolean;
  userCode?: string | null;
  onAssignSelf?: (id: number) => void;
  onUnassignSelf?: (id: number) => void;
}

export function CoursesTable({
  courses,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
  onSort,
  isProfessor,
  isAdmin,
  userCode,
  onAssignSelf,
  onUnassignSelf,
}: CoursesTableProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Check if any course has professor info to decide whether to show the column
  const showProfessorColumn = courses.some(
    (c) => "professor" in c && c.professor !== null,
  );

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
            <SortableTh
              sortKey="CourseCode"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Cod
              </Text>
            </SortableTh>
            <SortableTh
              sortKey="Name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Nume
              </Text>
            </SortableTh>
            <SortableTh
              sortKey="Credits"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Credite
              </Text>
            </SortableTh>
            <SortableTh
              sortKey="MaxEnrollment"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Capacitate
              </Text>
            </SortableTh>
            <SortableTh sortKey="EnrolledStudents">
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Înscriși
              </Text>
            </SortableTh>
            {showProfessorColumn && (
              <SortableTh>
                <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                  Profesor
                </Text>
              </SortableTh>
            )}
            <SortableTh
              sortKey="CreatedAt"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                Dată Creare
              </Text>
            </SortableTh>
            <SortableTh width={120}>
              <Center>
                <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                  Acțiuni
                </Text>
              </Center>
            </SortableTh>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {courses.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={showProfessorColumn ? 8 : 7}>
                <Text ta="center" c="dimmed" py="xl">
                  Nu există cursuri înregistrate
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            courses.map((course) => {
              // Normalize fields
              const id =
                "id" in course
                  ? course.id
                  : (course as AssignedCourseResponse).courseId;
              const code =
                "courseCode" in course
                  ? course.courseCode
                  : (course as AssignedCourseResponse).code;
              const professor =
                "professor" in course ? course.professor : undefined;

              return (
                <Table.Tr key={id}>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color="gray"
                      size="md"
                      radius="sm"
                      styles={{
                        root: {
                          maxWidth: "none",
                        },
                        label: {
                          overflow: "visible",
                          textOverflow: "unset",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      {code}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {course.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue" size="md" radius="sm">
                      {course.credits}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="gray" size="md" radius="sm">
                      {course.maxEnrollment}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <Text size="sm">{course.enrolledStudents}</Text>
                      <Badge
                        color={course.hasAvailableSeats ? "teal" : "red"}
                        size="xs"
                        styles={{ root: { paddingLeft: 0, paddingRight: 0 } }}
                      />
                    </Group>
                  </Table.Td>
                  {showProfessorColumn && (
                    <Table.Td>
                      {professor ? (
                        <Badge
                          variant="light"
                          color="black"
                          radius="sm"
                          size="md"
                          styles={{
                            root: {
                              textTransform: "none",
                              cursor: isAdmin ? "pointer" : "default",
                            },
                          }}
                          onClick={(e) => {
                            if (!isAdmin) return;
                            e.stopPropagation();
                            navigate({ to: `/professors/${professor.id}` });
                          }}
                        >
                          {isProfessor && professor.code === userCode
                            ? "Dvs."
                            : professor.name}
                        </Badge>
                      ) : (
                        <Badge
                          variant="light"
                          color="gray"
                          size="sm"
                          radius="sm"
                          styles={{ root: { textTransform: "none" } }}
                        >
                          Neatribuit
                        </Badge>
                      )}
                    </Table.Td>
                  )}
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {formatDate(course.createdAt)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4} justify="center" wrap="nowrap">
                      <Tooltip label="Vizualizare">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          size="sm"
                          onClick={() => onView(id)}
                        >
                          <Eye size={16} />
                        </ActionIcon>
                      </Tooltip>

                      {isAdmin && (
                        <>
                          <Tooltip label="Editare">
                            <ActionIcon
                              variant="subtle"
                              color="yellow"
                              size="sm"
                              onClick={() => onEdit(id)}
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Ștergere">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() =>
                                onDelete({ id, name: course.name })
                              }
                            >
                              <Trash2 size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </>
                      )}

                      {isProfessor &&
                        onAssignSelf &&
                        "professor" in course &&
                        !(course as CourseResponse).professor && (
                          <Tooltip label="Preia Cursul">
                            <ActionIcon
                              variant="subtle"
                              color="teal"
                              size="sm"
                              onClick={() => onAssignSelf(id)}
                            >
                              <UserPlus size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}

                      {isProfessor &&
                        onUnassignSelf &&
                        ((professor && professor.code === userCode) ||
                          !("professor" in course)) && (
                          <Tooltip label="Renunță">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() => onUnassignSelf(id)}
                            >
                              <Trash2 size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
