'use client'

import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'

import {WorkspaceSidebar} from '@/components/nav/workspace-sidebar'
import {Separator} from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const Layout = observer(
  ({
    children,
  }: Readonly<{
    children: ReactNode
  }>) => {
    return (
      <SidebarProvider>
        <WorkspaceSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>

          <div className="flex-1 px-8 py-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    )
  },
)

export default Layout
