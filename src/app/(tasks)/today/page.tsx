'use client'

import { useQuery } from '@rocicorp/zero/react'
import { MoonIcon, StarIcon } from 'lucide-react'

import { PageContainer } from '@/components/shared/page-container'
import { TaskList } from '@/components/task/task-list'
import { useZero } from '@/hooks/use-zero'

export default function Page() {
  const zero = useZero()

  const [todayTasks] = useQuery(
    zero.query.task
      .where('start_bucket', '=', 'today')
      .where('start', '=', 'started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('sort_order', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  const [eveningTasks] = useQuery(
    zero.query.task
      .where('start_bucket', '=', 'evening')
      .where('start', '=', 'started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('sort_order', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  return (
    <PageContainer>
      <div className="mx-4 mb-6 flex items-center gap-2">
        <StarIcon className="size-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
      </div>

      <TaskList tasks={todayTasks} />

      {eveningTasks.length > 0 && (
        <>
          <div className="flex items-center gap-2 border-b border-border">
            <MoonIcon className="size-4" />
            <h1 className="text-base font-bold tracking-tight">Evening</h1>
          </div>

          <TaskList tasks={eveningTasks} />
        </>
      )}
    </PageContainer>
  )
}
