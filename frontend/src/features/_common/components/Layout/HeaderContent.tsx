import { Group, Burger, Image } from "@mantine/core";
import { UserMenu } from "@/features/_common/components/User/UserMenu";
import logo from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";

interface HeaderContentProps {
  mobileOpened: boolean;
  toggleMobile: () => void;
  desktopOpened: boolean;
  toggleDesktop: () => void;
}

export function HeaderContent({
  mobileOpened,
  toggleMobile,
  desktopOpened,
  toggleDesktop,
}: HeaderContentProps) {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Group>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
        </Group>
        <Link to="/">
          <Image
            src={logo}
            alt="Relevance Management"
            height={24}
            w="auto"
            fit="contain"
          />
        </Link>
      </Group>

      <UserMenu />
    </Group>
  );
}
