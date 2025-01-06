import { useQuery } from '@rocicorp/zero/react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/navigation'
import { useCallback, useContext } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useZero } from '@/hooks/use-zero'
import { RootStoreContext } from '@/lib/stores/root-store'
import { TaskRow } from '@/schema'

const sections = [
  {
    title: 'Recent',
    items: [
      { id: 'today', title: 'Today', url: '/today' },
      { id: 'anytime', title: 'Anytime', url: '/anytime' },
      { id: 'inbox', title: 'Inbox', url: '/inbox' },
      { id: 'upcoming', title: 'Upcoming', url: '/upcoming' },
      { id: 'someday', title: 'Someday', url: '/someday' },
      { id: 'logbook', title: 'Logbook', url: '/logbook' },
    ],
  },
]

export const QuickFindCommand = observer(() => {
  const router = useRouter()
  const zero = useZero()
  const {
    localStore: {
      quickFindQuery,
      setQuickFindQuery,
      quickFindOpen,
      setQuickFindOpen,
      setSelectedTaskIds,
    },
  } = useContext(RootStoreContext)

  // Fetch all non-archived, non-completed tasks
  const [filteredTasks] = useQuery(
    zero.query.task
      .where('title', 'ILIKE', `%${quickFindQuery}%`)
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null),
    !!quickFindQuery,
  )

  useHotkeys('meta+k, ctrl+k, meta+f', (e) => {
    e.preventDefault()
    setQuickFindOpen(!quickFindOpen)
  })

  useHotkeys('esc', () => {
    if (quickFindOpen) {
      setQuickFindOpen(false)
    }
  })

  const handleSelect = useCallback(
    (url: string) => {
      setQuickFindOpen(false)
      router.push(url)
    },
    [router, setQuickFindOpen],
  )

  const handleTaskSelect = useCallback(
    (task: TaskRow) => {
      setQuickFindOpen(false)

      // Set the selected task ID first
      setSelectedTaskIds([task.id])

      // Determine which route to navigate to based on task properties
      let targetRoute = '/inbox' // default route

      if (task.completed_at) {
        targetRoute = '/logbook'
      } else if (task.archived_at) {
        targetRoute = '/trash'
      } else {
        switch (task.start) {
          case 'started':
            targetRoute = '/today'
            break
          case 'postponed':
            // Someday tasks have start='postponed' and no start_date
            targetRoute = task.start_date === null ? '/someday' : '/upcoming'
            break
          case 'not_started':
            targetRoute = task.start_bucket === 'inbox' ? '/inbox' : '/anytime'
            break
        }
      }

      router.push(targetRoute)
    },
    [router, setQuickFindOpen, setSelectedTaskIds],
  )

  return (
    <CommandDialog open={quickFindOpen} onOpenChange={setQuickFindOpen}>
      <CommandInput
        placeholder="Quick Find"
        value={quickFindQuery}
        onValueChange={setQuickFindQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {quickFindQuery.length > 0 && filteredTasks?.length > 0 && (
          <CommandGroup heading="Tasks">
            {filteredTasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`task-${task.id}-${task.title}`} // Make value more unique
                onSelect={() => handleTaskSelect(task)}
              >
                {task.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Show standard sections when not searching */}
        {!quickFindQuery &&
          sections.map((section) => (
            <CommandGroup key={section.title} heading={section.title}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item.url)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span>{item.title}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
      </CommandList>
    </CommandDialog>
  )
})
