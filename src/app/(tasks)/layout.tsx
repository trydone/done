'use client'
import { observer } from 'mobx-react-lite'
import { ReactNode, useCallback, useContext } from 'react'

import { DndProvider } from '@/components/dnd/dnd-context'
import { AppSidebar } from '@/components/nav/app-sidebar'
import { Footer } from '@/components/nav/footer'
import { QuickFindCommand } from '@/components/quick-find/quick-find-command'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { RootStoreContext } from '@/lib/stores/root-store'
import { cn } from '@/lib/utils'

const Layout = observer(
  ({
    children,
  }: Readonly<{
    children: ReactNode
  }>) => {
    const {
      localStore: { openTaskId, setOpenTaskId, setSelectedTaskIds },
    } = useContext(RootStoreContext)

    const handleBackgroundClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement

        if (
          e.target === e.currentTarget ||
          target.classList.contains('task-outside-click')
        ) {
          setOpenTaskId(null)
          setSelectedTaskIds([])
        }
      },
      [setOpenTaskId, setSelectedTaskIds],
    )

    return (
      <>
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
                className={cn(
                  'flex flex-1 flex-col gap-4 px-4 py-10 transition-colors',
                  {
                    'bg-sidebar': !!openTaskId,
                  },
                )}
              >
                {children}
              </div>

              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </DndProvider>

        <QuickFindCommand />
      </>
    )
  },
)

export default Layout
