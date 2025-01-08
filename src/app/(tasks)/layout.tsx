'use client'
import {observer} from 'mobx-react-lite'
import {ReactNode, useCallback, useContext} from 'react'

import {DndProvider} from '@/components/dnd/dnd-context'
import {AppSidebar} from '@/components/nav/app-sidebar'
import {Footer} from '@/components/nav/footer'
import {QuickFindCommand} from '@/components/quick-find/quick-find-command'
import {WhenDialogWrapper} from '@/components/task/when-dialog-wrapper'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {RootStoreContext} from '@/lib/stores/root-store'
import {cn} from '@/lib/utils'

const Layout = observer(
  ({
    children,
  }: Readonly<{
    children: ReactNode
  }>) => {
    const {
      localStore: {openTaskId, setOpenTaskId, setSelectedTaskIds},
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
              <SidebarTrigger />
              <div
                onClick={handleBackgroundClick}
                className={cn('flex flex-1 transition-colors', {
                  'bg-sidebar dark:bg-background': !!openTaskId,
                })}
              >
                <div className="task-outside-click mx-auto flex w-full max-w-[1000px] flex-1 flex-col gap-4 px-4 py-10 md:px-8 lg:px-12">
                  {children}
                </div>
              </div>
              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </DndProvider>

        <QuickFindCommand />
        <WhenDialogWrapper />
      </>
    )
  },
)

export default Layout
