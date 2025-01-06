"use client";
import {
  ArchiveIcon,
  BookCheckIcon,
  CalendarIcon,
  InboxIcon,
  LayersIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { AppSidebarItem } from "./app-sidebar-item";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { WorkspaceSwitch } from "../workspace/workspace-switch";

const items: AppSidebarItemType[] = [
  {
    id: 'inbox',
    title: 'Inbox',
    url: '/inbox',
    icon: InboxIcon,
  },
  {
    id: 'today',
    title: 'Today',
    url: '/today',
    icon: StarIcon,
  },
  {
    id: 'upcoming',
    title: 'Upcoming',
    url: '/upcoming',
    icon: CalendarIcon,
  },
  {
    id: 'anytime',
    title: 'Anytime',
    url: '/anytime',
    icon: LayersIcon,
  },
  {
    id: 'someday',
    title: 'Someday',
    url: '/someday',
    icon: ArchiveIcon,
  },
  {
    id: 'logbook',
    title: 'Logbook',
    url: '/logbook',
    icon: BookCheckIcon,
  },
  {
    id: 'trash',
    title: 'Trash',
    url: '/trash',
    icon: TrashIcon,
  },
]

export const AppSidebar = () => {
  return (
    <Sidebar ref={setNodeRef}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <BlockWorkspaceSwitch />
              <BlockUsers />

              {items.map((item, index) => (
                <AppSidebarItem item={item} key={index} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const useGithubLogin = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();
  const link = [pathname, searchParams].filter(Boolean).join("?");
  return "/api/auth/github?redirect=" + encodeURIComponent(link);
};

const useIsLoggedIn = () => {
  const zero = useZero();
  const [sessions] = useQuery(zero.query.session);
  return sessions.length > 0;
};

const BlockWorkspaceSwitch = () => {
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) {
    return null;
  }

  return <WorkspaceSwitch.Block />;
};

const BlockUsers = () => {
  const isLoggedIn = useIsLoggedIn();

  const zero = useZero();
  const [users] = useQuery(zero.query.user);

  const loginRef = useGithubLogin();

  if (!isLoggedIn) {
    return <a href={loginRef}>Login</a>;
  }

  return users.map((user) => (
    <img
      key={user.id}
      src={user?.avatar || ""}
      className="issue-creator-avatar"
      alt={user?.name ?? undefined}
      title={user?.username}
    />
  ));
};
