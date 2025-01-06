'use client'

import { useQuery } from '@rocicorp/zero/react'
import { BookCheckIcon } from 'lucide-react'

import { PageContainer } from '@/components/shared/page-container'
import { TaskList } from '@/components/task/task-list'
import { useZero } from '@/hooks/use-zero'

export default function Page() {
  const zero = useZero()

  const [tasks] = useQuery(
    zero.query.task
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS NOT', null)
      .orderBy('completed_at', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  return (
    <PageContainer>
      <div className="mx-4 mb-6 flex items-center gap-2">
        <BookCheckIcon className="size-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Logbook</h1>
      </div>

      <TaskList tasks={tasks} />
    </PageContainer>
  )
}
