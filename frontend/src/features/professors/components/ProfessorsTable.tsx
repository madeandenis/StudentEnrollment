import {
  Table,
  Text,
  ActionIcon,
  Group,
  Tooltip,
  Center,
  Badge,
  Anchor,
} from "@mantine/core";
import { Eye, Pencil, Trash2, BookOpen } from "lucide-react";
import type { ProfessorResponse } from "@/features/professors/_common/types";
import { SortableTh } from "@/features/_common/components/SortableTh";

interface ProfessorsTableProps {
  professors: ProfessorResponse[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: ({ id, fullName }: { id: number; fullName: string }) => void;
  onAssign?: (professor: ProfessorResponse) => void;
  onSort?: (column: string) => void;
  isAdmin?: boolean;
}

export function ProfessorsTable({
  professors,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
  onAssign,
  onSort,
  isAdmin,
}: ProfessorsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="md" horizontalSpacing="md" withTableBorder highlightOnHover>
        <Table.Thead bg="gray.0">
          <Table.Tr>
            <SortableTh
              sortKey="ProfessorCode"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
              width={140}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">Cod</Text>
            </SortableTh>
            <SortableTh
              sortKey="FullName"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">Nume Complet</Text>
            </SortableTh>
            <SortableTh
              sortKey="Email"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">Email</Text>
            </SortableTh>
            <SortableTh
              sortKey="PhoneNumber"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">Telefon</Text>
            </SortableTh>

            <SortableTh
              sortKey="CreatedAt"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">Dată Creare</Text>
            </SortableTh>
            <SortableTh width={isAdmin && onAssign ? 160 : 120}>
              <Center><Text size="xs" fw={600} tt="uppercase" c="dimmed">Acțiuni</Text></Center>
            </SortableTh>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {professors.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center" c="dimmed" py="xl">
                  Nu există profesori înregistrați
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            professors.map((professor) => (
              <Table.Tr key={professor.id}>
                <Table.Td>
                  <Badge
                    variant="light"
                    color="gray"
                    size="md"
                    radius="sm"
                    styles={{ root: { textTransform: 'none', fontFamily: 'monospace' } }}
                  >
                    {professor.professorCode}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>{professor.fullName}</Text>
                </Table.Td>
                <Table.Td>
                  <Anchor
                    href={`mailto:${professor.email}`}
                    size="sm"
                    c="violet"
                    td="underline"
                  >
                    {professor.email}
                  </Anchor>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{professor.phoneNumber}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">{formatDate(professor.createdAt)}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4} justify="center" wrap="nowrap">
                    <Tooltip label="Vizualizare">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="sm"
                        onClick={() => onView(professor.id)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    {isAdmin && onAssign && (
                      <Tooltip label="Alocă la Curs">
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          size="sm"
                          onClick={() => onAssign(professor)}
                        >
                          <BookOpen size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    <Tooltip label="Editare">
                      <ActionIcon
                        variant="subtle"
                        color="yellow"
                        size="sm"
                        onClick={() => onEdit(professor.id)}
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
                          onDelete({
                            id: professor.id,
                            fullName: professor.fullName,
                          })
                        }
                      >
                        <Trash2 size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
