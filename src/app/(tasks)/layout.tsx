"use client";
import { ReactNode, useCallback, useContext } from "react";
import { cn } from "@/lib/utils";
import { RootStoreContext } from "@/lib/stores/root-store";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { DndProvider } from "@/components/dnd/dnd-context";
import { Footer } from "@/components/nav/footer";
import { observer } from "mobx-react-lite";

const Layout = observer(
  ({
    children,
  }: Readonly<{
    children: ReactNode;
  }>) => {
    const {
      localStore: { openTaskId, setOpenTaskId },
    } = useContext(RootStoreContext);

    const handleBackgroundClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        // Only handle clicks directly on the background div
        if (e.target === e.currentTarget) {
          setOpenTaskId(null);
        }
      },
      [setOpenTaskId],
    );

    return (
      <DndProvider>
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2">
              <div className="flex flex-1 items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
            </header>

            <div
              onClick={handleBackgroundClick}
              className={cn("flex flex-1 flex-col gap-4 px-4 py-10", {
                "bg-muted": !!openTaskId,
              })}
            >
              {children}
            </div>

            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </DndProvider>
    );
  },
);

export default Layout;
