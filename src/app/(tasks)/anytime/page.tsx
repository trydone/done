'use client'

import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import { addDays, startOfDay } from 'date-fns'
import {LayersIcon} from 'lucide-react'

import {PageContainer} from '@/components/shared/page-container'
import {TaskList} from '@/components/task/task-list'
import {useZero} from '@/hooks/use-zero'

export default function Page() {
  const zero = useZero()

  const tomorrow = addDays(startOfDay(new Date()), 1).getTime()

  const [tasks] = useQuery(
    zero.query.task
      .where('start', '=', 'started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .where(({or, cmp}) =>
        or(cmp('start_date', 'IS', null), cmp('start_date', '<', tomorrow)),
      )
      .orderBy('start', 'asc')
      .orderBy('start_bucket', 'desc')
      .orderBy('sort_order', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  return (
    <PageContainer>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <LayersIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Anytime</h1>
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <LayersIcon className="size-16 opacity-30" />
        </div>
      )}
      <SortableContext
        items={[{id: 'anytime'}]}
        strategy={verticalListSortingStrategy}
      >
        <TaskList tasks={tasks} showWhenIcon listData={{id: 'anytime'}} />
      </SortableContext>
    </PageContainer>
  )
}
