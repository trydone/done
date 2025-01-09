'use client'
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import {
  addDays,
  format,
  isThisWeek,
  isThisYear,
  isToday,
  isTomorrow,
  startOfDay,
} from 'date-fns'
import {CalendarIcon} from 'lucide-react'
import {observer} from 'mobx-react-lite'

import {useDndContext} from '@/components/dnd/dnd-context'
import {PageContainer} from '@/components/shared/page-container'
import {TaskList} from '@/components/task/task-list'
import {Task} from '@/components/task/types'
import {useTaskSelection} from '@/hooks/use-task-selection'
import {useZero} from '@/hooks/use-zero'

// Helper function to format date headers
const formatDateHeader = (date: Date) => {
  if (isToday(date)) {
    return 'Today'
  }
  if (isTomorrow(date)) {
    return 'Tomorrow'
  }
  if (isThisWeek(date)) {
    return format(date, 'EEEE') // Full day name
  }
  if (isThisYear(date)) {
    return format(date, 'd MMMM') // e.g. "15 January"
  }
  return format(date, 'd MMMM yyyy') // e.g. "15 January 2025"
}

// Helper function to group tasks by date
const groupTasksByDate = (tasks: readonly Task[]) => {
  const groups = tasks.reduce(
    (groups: Record<string, {date: Date; tasks: Task[]}>, task) => {
      // Changed to string
      const date = new Date(task.start_date!)
      const dateKey = date.getTime()
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date,
          tasks: [],
        }
      }
      groups[dateKey].tasks.push(task)
      return groups
    },
    {},
  )

  return Object.entries(groups)
    .sort(([keyA], [keyB]) => {
      return Number(keyA) - Number(keyB) // Convert back to numbers for comparison
    })
    .reduce(
      (sorted, [key, value]) => {
        sorted[key] = value
        return sorted
      },
      {} as Record<string, {date: Date; tasks: Task[]}>, // Changed to string
    )
}

const Page = observer(() => {
  const {dragOverId, activeId} = useDndContext()

  const tomorrow = addDays(startOfDay(new Date()), 1).getTime()

  const zero = useZero()
  const [tasks] = useQuery(
    zero.query.task
      .where('start', '=', 'started')
      .where('start_date', '>=', tomorrow)
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('sort_order', 'asc')
      .related('tags', (q) => q.orderBy('updated_at', 'desc'))
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  const newTasks = tasks.map((task) => {
    if (dragOverId && task.id === activeId) {
      // If task is being dragged, only show it in the list it's currently over
      const targetDateKey = dragOverId.replace('upcoming-', '')

      return {...task, start_date: parseInt(targetDateKey)}
    }
    return task
  })

  const initialGroupedTasks = groupTasksByDate(tasks || [])

  const groupedTasks = groupTasksByDate(newTasks || [])

  const {handleClick} = useTaskSelection(
    Object.values(groupedTasks)
      .flatMap((group) => group.tasks)
      .map((task) => task.id),
  )

  return (
    <PageContainer>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <CalendarIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Upcoming</h1>
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <CalendarIcon className="size-16 opacity-30" />
        </div>
      )}

      <SortableContext
        items={Object.keys(initialGroupedTasks).map((dateKey) => ({
          id: `upcoming-${dateKey}`,
        }))}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col">
          {Object.keys(initialGroupedTasks).map((dateKey) => {
            const item = initialGroupedTasks[dateKey]!
            const newItem = groupedTasks[dateKey]

            return (
              <div key={dateKey}>
                <div className="task-outside-click mx-4 pb-2">
                  <div className="task-outside-click flex items-center gap-2 border-b border-border py-1 pt-6">
                    <h1 className="task-outside-click text-base font-bold tracking-tight">
                      {formatDateHeader(item.date)}
                    </h1>
                  </div>
                </div>

                <TaskList
                  tasks={newItem?.tasks || []}
                  listData={{
                    id: `upcoming-${dateKey}`,
                    start: 'started',
                    start_date: item.date.getTime(),
                  }}
                  onTaskClick={handleClick}
                />
              </div>
            )
          })}
        </div>
      </SortableContext>
    </PageContainer>
  )
})

export default Page
