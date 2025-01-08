import {useDroppable} from '@dnd-kit/core'
import {useQuery} from '@rocicorp/zero/react'
import {addDays, startOfDay} from 'date-fns'
import {
  ArchiveIcon,
  BookCheckIcon,
  CalendarIcon,
  InboxIcon,
  LayersIcon,
  LogIn,
  StarIcon,
  TrashIcon,
} from 'lucide-react'
import {usePathname, useSearchParams} from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'
import {useZero} from '@/hooks/use-zero'

import {WorkspaceSwitch} from '../workspace/workspace-switch'
import {AppSidebarItem, AppSidebarItemType} from './app-sidebar-item'

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
  const {setNodeRef} = useDroppable({
    id: 'sidebar-container',
    data: {
      type: 'sidebar',
    },
  })

  return (
    <div>
      <Sidebar ref={setNodeRef}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <BlockWorkspaceSwitch />
                <BlockLoginGoogle />
                <BlockLoginGithub />
                <BlockSidebarItems />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}

const useGithubLogin = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams().toString()
  const link = [pathname, searchParams].filter(Boolean).join('?')
  return '/api/auth/github?redirect=' + encodeURIComponent(link)
}

const useGoogleLogin = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams().toString()
  const link = [pathname, searchParams].filter(Boolean).join('?')
  return '/api/auth/google?redirect_url=' + encodeURIComponent(link)
}

const useIsLoggedIn = () => {
  const zero = useZero()
  const [sessions] = useQuery(zero.query.session)
  return sessions.length > 0
}

const BlockSidebarItems = () => {
  const pathname = usePathname()
  const zero = useZero()

  const tomorrow = addDays(startOfDay(new Date()), 1).getTime()

  const [inboxTasks] = useQuery(
    zero.query.task
      .where('start', '=', 'not_started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null),
  )

  const [todayTasks] = useQuery(
    zero.query.task
      .where('start', '=', 'started')
      .where('start_date', '<', tomorrow)
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null),
  )

  return items.map((item) => {
    let count = undefined

    if (item.id === 'inbox' && inboxTasks.length > 0) {
      count = inboxTasks.length
    } else if (item.id === 'today' && todayTasks.length > 0) {
      count = todayTasks.length
    }
    return (
      <AppSidebarItem
        item={item}
        key={item.id}
        count={count}
        isActive={pathname === item.url}
      />
    )
  })
}

const BlockWorkspaceSwitch = () => {
  const isLoggedIn = useIsLoggedIn()

  if (!isLoggedIn) {
    return null
  }

  return <WorkspaceSwitch.Block />
}

const BlockLoginGoogle = () => {
  const loginRef = useGoogleLogin()

  return (
    <div className="flex gap-2 px-2">
      <LogIn size={16} />
      <a href={loginRef}>Login (google)</a>
    </div>
  )
}

const BlockLoginGithub = () => {
  const loginRef = useGithubLogin()

  return (
    <div className="flex gap-2 px-2">
      <LogIn size={16} />
      <a href={loginRef}>Login (github)</a>
    </div>
  )
}
