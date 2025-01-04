import {
  ArchiveIcon,
  BookCheckIcon,
  CalendarIcon,
  InboxIcon,
  LayersIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { AppSidebarItem } from "./app-sidebar-item";
import { useLogin } from "@/hooks/use-login";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { WorkspaceSwitch } from "../workspace/workspace-switch";

const items = [
  {
    title: "Inbox",
    url: "/inbox",
    icon: InboxIcon,
  },
  {
    title: "Today",
    url: "/today",
    icon: StarIcon,
  },
  {
    title: "Upcoming",
    url: "/upcoming",
    icon: CalendarIcon,
  },
  {
    title: "Anytime",
    url: "/anytime",
    icon: LayersIcon,
  },
  {
    title: "Someday",
    url: "/someday",
    icon: ArchiveIcon,
  },
  {
    title: "Logbook",
    url: "/logbook",
    icon: BookCheckIcon,
  },
  {
    title: "Trash",
    url: "/trash",
    icon: TrashIcon,
  },
];

export const AppSidebar = () => {
  const login = useLogin();

  const zero = useZero();
  const [user] = useQuery(
    zero.query.user.where("id", login.loginState?.decoded.sub ?? "").one(),
  );

  const loginHref =
    "/api/auth/github?redirect=" +
    encodeURIComponent(
      window.location.search
        ? window.location.pathname + window.location.search
        : window.location.pathname,
    );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <WorkspaceSwitch.Block />

              {items.map((item, index) => (
                <AppSidebarItem item={item} key={index} />
              ))}

              {login.loginState === undefined ? (
                <a href={loginHref}>Login</a>
              ) : (
                <img
                  src={user?.avatar || ""}
                  className="issue-creator-avatar"
                  alt={user?.name ?? undefined}
                  title={user?.username}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
