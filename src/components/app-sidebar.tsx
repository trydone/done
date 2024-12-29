import {
  ArchiveIcon,
  BookCheckIcon,
  CalendarIcon,
  InboxIcon,
  LayersIcon,
  StarIcon,
  TrashIcon,
  ChevronsUpDown,
  CheckIcon,
  PlusIcon,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLogin } from "@/lib/hooks/use-login";
import { useQuery, useZero } from "@rocicorp/zero/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { getUserInitials } from "@/lib/helpers";

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
  const login = useLogin();
  const zero = useZero();
  const activeUser = login.getActiveUser();
  const activeWorkspace = login.getActiveWorkspace();

  const getLoginHref = (pathname: string, search: string | null) => {
    return (
      "/api/login/github?redirect=" +
      encodeURIComponent(search ? pathname + search : pathname)
    );
  };

  const loginHref = getLoginHref(
    window.location.pathname,
    window.location.search,
  );

  return (
    <Sidebar>
      <SidebarHeader>
        {login.loginState !== undefined ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8">
                      {activeWorkspace ? (
                        <AvatarImage
                          src={activeWorkspace.avatar}
                          alt={activeWorkspace.name}
                        />
                      ) : (
                        <AvatarImage
                          src={activeUser?.avatar}
                          alt={activeUser?.name}
                        />
                      )}
                      <AvatarFallback>
                        {getUserInitials(
                          activeWorkspace?.name ||
                            activeUser?.name ||
                            "User Name",
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-medium">
                        {activeWorkspace?.name || activeUser?.name}
                      </span>
                      {activeWorkspace && (
                        <span className="text-xs text-muted-foreground">
                          {activeUser?.name}
                        </span>
                      )}
                    </div>

                    <ChevronsUpDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[300px]" align="start">
                  {Object.values(login.loginState.users).map((userAuth) => (
                    <DropdownMenuItem
                      key={userAuth.decoded.userId}
                      className="p-0"
                    >
                      <div className="flex flex-col w-full">
                        <div
                          className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                          onClick={() =>
                            login.switchUser(userAuth.decoded.userId)
                          }
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={userAuth.decoded.avatar} />
                            <AvatarFallback>
                              {getUserInitials(userAuth.decoded.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1">
                            {userAuth.decoded.name}
                          </span>
                          {activeUser?.id === userAuth.decoded.userId &&
                            !activeWorkspace && (
                              <CheckIcon className="h-4 w-4" />
                            )}
                        </div>

                        {userAuth.decoded.workspaces?.map((workspace) => (
                          <div
                            key={workspace.id}
                            className="flex items-center gap-2 p-2 pl-10 hover:bg-accent cursor-pointer"
                            onClick={() => {
                              login.switchUser(userAuth.decoded.userId);
                              login.switchWorkspace(workspace.id);
                            }}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={workspace.avatar} />
                              <AvatarFallback>
                                {getUserInitials(workspace.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="flex-1 text-sm">
                              {workspace.name}
                            </span>
                            {activeWorkspace?.id === workspace.id && (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Join or create workspace
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => login.logout(activeUser?.id)}
                    className="text-destructive gap-2"
                  >
                    Log out {activeUser?.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <a href={loginHref} className="text-sm font-medium">
            Login
          </a>
        )}
      </SidebarHeader>

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
