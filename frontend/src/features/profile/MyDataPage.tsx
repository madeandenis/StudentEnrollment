import { Title, Group, Button, Stack, Table, Text, Badge } from "@mantine/core";
import { Download, FileText } from "lucide-react";
import { useAuth } from "@/features/auth/_contexts/AuthContext";
import { useStudentDetails } from "@/features/students/get-details/useStudentDetails";
import { useProfessorDetails } from "@/features/professors/get-details/useProfessorDetails";

export function MyDataPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return "-";
    if (key === "roles" && Array.isArray(value)) {
      return value.join(", ");
    }
    return String(value);
  };

  const getDataRows = () => [
    { key: "Nume Utilizator", value: user.userName },
    { key: "Prenume", value: user.firstName },
    { key: "Nume", value: user.lastName },
    { key: "Email", value: user.email },
    { key: "Telefon", value: user.phoneNumber },
    ...(user.studentCode != null
      ? [{ key: "Cod Student", value: user.studentCode }]
      : []),
    ...(user.professorCode != null
      ? [{ key: "Cod Profesor", value: user.professorCode }]
      : []),
    ...(user.roles != null && user.roles.length > 0
      ? [{ key: "Roluri", value: user.roles.join(", ") }]
      : []),
  ];

  const { data: student } = useStudentDetails(user.studentCode || null);
  const { data: professor } = useProfessorDetails(user.professorCode || null);

  const getEnhancedDataRows = () => {
    const basicRows = getDataRows();

    if (user.studentCode && student) {
      return [
        ...basicRows,
        { key: "CNP", value: student.cnp },
        { key: "Dată Naștere", value: student.dateOfBirth },
        {
          key: "Adresă",
          value: [
            student.address?.address1,
            student.address?.address2,
            student.address?.city,
            student.address?.country,
            student.address?.postalCode,
          ]
            .filter(Boolean)
            .join(", "),
        },
      ];
    }

    if (user.professorCode && professor) {
      return [
        ...basicRows,
        {
          key: "Adresă",
          value: [
            professor.address?.address1,
            professor.address?.address2,
            professor.address?.city,
            professor.address?.country,
            professor.address?.postalCode,
          ]
            .filter(Boolean)
            .join(", "),
        },
      ];
    }

    return basicRows;
  };

  const handleDownloadCsv = () => {
    const rows = getEnhancedDataRows();
    const headers = ["Atribut", "Valoare"];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => {
        const val = formatValue(row.key, row.value);
        const escapedVal = val.includes(",") ? `"${val}"` : val;
        return `${row.key},${escapedVal}`;
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "datele_mele.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <Title order={3}>Datele Mele</Title>
          <FileText
            size={22}
            style={{ color: "var(--mantine-color-blue-6)" }}
          />
        </Group>
        <Button
          leftSection={<Download size={18} />}
          onClick={handleDownloadCsv}
          variant="filled"
          color="blue"
        >
          Descarcă CSV
        </Button>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Atribut</Table.Th>
            <Table.Th>Valoare</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {getEnhancedDataRows().map((row) => (
            <Table.Tr key={row.key}>
              <Table.Td fw={500}>{row.key}</Table.Td>
              <Table.Td>
                {row.key === "Roluri" && Array.isArray(row.value) ? (
                  <Group gap="xs">
                    {row.value.map((role: string) => (
                      <Badge key={role} variant="dot" size="sm">
                        {role}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="sm">{formatValue(row.key, row.value)}</Text>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
