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

const items = [
  {
    title: "Inbox",
    url: "inbox",
    icon: InboxIcon,
  },
  {
    title: "Today",
    url: "today",
    icon: StarIcon,
  },
  {
    title: "Upcoming",
    url: "upcoming",
    icon: CalendarIcon,
  },
  {
    title: "Anytime",
    url: "anytime",
    icon: LayersIcon,
  },
  {
    title: "Someday",
    url: "someday",
    icon: ArchiveIcon,
  },
  {
    title: "Logbook",
    url: "logbook",
    icon: BookCheckIcon,
  },
  {
    title: "Trash",
    url: "trash",
    icon: TrashIcon,
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
