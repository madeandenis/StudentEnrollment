import { Menu, UnstyledButton, rem } from "@mantine/core";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useLogout } from "@/features/auth/logout/useLogout";
import { UserAvatar } from "@/features/_common/components/User/UserAvatar";
import { useAuth } from "@/features/auth/_contexts/AuthContext";

export function UserMenu() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync(undefined);

      navigate({ to: "/login" } as any);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <UserAvatar user={user} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Cont</Menu.Label>

        <Menu.Item
          leftSection={<User style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => navigate({ to: "/profile" } as any)}
        >
          Profil
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<LogOut style={{ width: rem(14), height: rem(14) }} />}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Se deconectează..." : "Deconectare"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
