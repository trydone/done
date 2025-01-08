import {
  ArrowLeftIcon,
  GroupIcon,
  HomeIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react'
import {observer} from 'mobx-react-lite'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'
import {WorkspaceSelect} from '@/components/workspace/workspace-select'

type WorkspaceSidebarItemType = {
  id: string
  title: string
  url: string
  icon: React.ComponentType
}

const items: WorkspaceSidebarItemType[] = [
  {
    id: 'general',
    title: 'General',
    url: '/workspace/general',
    icon: HomeIcon,
  },
  {
    id: 'members',
    title: 'Members',
    url: '/workspace/members',
    icon: UsersIcon,
  },
  {
    id: 'tags',
    title: 'Tags',
    url: '/workspace/tags',
    icon: TagIcon,
  },
  {
    id: 'teams',
    title: 'Teams',
    url: '/workspace/teams',
    icon: GroupIcon,
  },
]

export const WorkspaceSidebar = observer(() => {
  const pathname = usePathname()
  const fromWorkspaceSelect = WorkspaceSelect.useBlock()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Link
                href="/inbox"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowLeftIcon />
                Back to Inbox
              </Link>

              {fromWorkspaceSelect.workspaces.length > 1 && (
                <div className="border-y px-3 py-2">
                  <WorkspaceSelect {...fromWorkspaceSelect} />
                </div>
              )}

              {items.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.url)

                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon />
                    {item.title}
                  </Link>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
})
