'use client'
import { useQuery } from '@rocicorp/zero/react'
import { format, isThisWeek, isThisYear, isToday, isTomorrow } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { PageContainer } from '@/components/shared/page-container'
import { TaskList } from '@/components/task/task-list'
import { useZero } from '@/hooks/use-zero'

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
const groupTasksByDate = (tasks) => {
  return tasks.reduce((groups, task) => {
    const date = new Date(task.start_date)
    const dateKey = date.toISOString()
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date,
        tasks: [],
      }
    }
    groups[dateKey].tasks.push(task)
    return groups
  }, {})
}

export default function Page() {
  const zero = useZero()
  const [tasks] = useQuery(
    zero.query.task
      .where('start', '=', 'postponed')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('start_date', 'asc') // Changed to ascending for chronological order
      .orderBy('sort_order', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  const groupedTasks = groupTasksByDate(tasks || [])

  return (
    <PageContainer>
      <div className="task-outside-click mx-4 mb-6 flex items-center gap-2">
        <CalendarIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Upcoming</h1>
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <CalendarIcon className="size-16 opacity-30" />
        </div>
      )}

      {Object.entries(groupedTasks).length === 0 ? (
        <div className="mx-4 text-muted-foreground">No upcoming tasks</div>
      ) : (
        Object.entries(groupedTasks).map(
          ([dateKey, { date, tasks: tasksForDate }]) => (
            <div key={dateKey} className="mb-8">
              <h2 className="task-outside-click mx-4 mb-4 text-lg font-medium">
                {formatDateHeader(date)}
              </h2>
              <TaskList tasks={tasksForDate} />
            </div>
          ),
        )
      )}
    </PageContainer>
  )
}
