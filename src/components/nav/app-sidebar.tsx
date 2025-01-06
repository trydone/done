/* eslint-disable @next/next/no-img-element */
import { useQuery } from '@rocicorp/zero/react'
import {
  ArchiveIcon,
  BookCheckIcon,
  CalendarIcon,
  InboxIcon,
  LayersIcon,
  StarIcon,
  TrashIcon,
} from 'lucide-react'
import { useContext } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { useZero } from '@/hooks/use-zero'
import { RootStoreContext } from '@/lib/stores/root-store'

import { WorkspaceSwitch } from '../workspace/workspace-switch'
import { AppSidebarItem, AppSidebarItemType } from './app-sidebar-item'

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
  const {
    authStore: { loginState },
  } = useContext(RootStoreContext)

  const zero = useZero()
  const [user] = useQuery(
    zero.query.user.where('id', loginState?.decoded.sub ?? '').one(),
  )

  const [inboxTasks] = useQuery(
    zero.query.task
      .where('start', '=', 'not_started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null),
  )

  const [todayTasks] = useQuery(
    zero.query.task
      .where('start', '=', 'started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null),
  )

  const loginHref =
    '/api/auth/github?redirect=' +
    encodeURIComponent(
      window.location.search
        ? window.location.pathname + window.location.search
        : window.location.pathname,
    )

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <WorkspaceSwitch.Block />

              {items.map((item, index) => {
                let count = undefined

                if (item.id === 'inbox' && inboxTasks.length > 0) {
                  count = inboxTasks.length
                } else if (item.id === 'today' && todayTasks.length > 0) {
                  count = todayTasks.length
                }
                return <AppSidebarItem item={item} key={index} count={count} />
              })}

              {!loginState ? (
                <a href={loginHref}>Login</a>
              ) : (
                <img
                  src={user?.avatar || '#'}
                  alt={user?.name ?? undefined}
                  title={user?.username}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
