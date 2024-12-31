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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";

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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
