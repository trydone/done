'use client'

import { useDroppable } from '@dnd-kit/core'
import { useQuery } from '@rocicorp/zero/react'
import { MoonIcon, StarIcon } from 'lucide-react'

import { PageContainer } from '@/components/shared/page-container'
import { TaskList } from '@/components/task/task-list'
import { useZero } from '@/hooks/use-zero'
import { cn } from '@/lib/utils'

export default function Page() {
  const { setNodeRef: setTodayRef } = useDroppable({
    id: 'today-list',
    data: { type: 'bucket' },
  })

  const { setNodeRef: setEveningRef } = useDroppable({
    id: 'evening-list',
    data: { type: 'bucket' },
  })

  const zero = useZero()

  const [tasks] = useQuery(
    zero.query.task
      .where('start', '=', 'started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('sort_order', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  const todayTasks = tasks.filter((task) => task.start_bucket !== 'evening')
  const eveningTasks = tasks.filter((task) => task.start_bucket === 'evening')

  return (
    <PageContainer>
      <div ref={setTodayRef}>
        <div
          className={cn('task-outside-click mx-4 flex items-center gap-2', {
            'mb-6': tasks.length === 0 || todayTasks.length > 0,
          })}
        >
          <StarIcon className="task-outside-click size-6" />
          <h1 className="h3 task-outside-click">Today</h1>
        </div>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <StarIcon className="size-16 opacity-30" />
          </div>
        )}

        <TaskList tasks={todayTasks} />
      </div>

      {eveningTasks.length > 0 && (
        <div ref={setEveningRef}>
          <div className="mx-4 mt-6">
            <div className="task-outside-click flex items-center gap-2 border-b border-border py-1">
              <MoonIcon className="task-outside-click size-4" />
              <h1 className="task-outside-click text-base font-bold tracking-tight">
                This Evening
              </h1>
            </div>
          </div>

          <TaskList tasks={eveningTasks} />
        </div>
      )}
    </PageContainer>
  )
}
