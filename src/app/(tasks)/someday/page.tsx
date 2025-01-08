'use client'

import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import {ArchiveIcon} from 'lucide-react'

import {PageContainer} from '@/components/shared/page-container'
import {TaskList} from '@/components/task/task-list'
import {useZero} from '@/hooks/use-zero'

export default function Page() {
  const zero = useZero()

  const [tasks] = useQuery(
    zero.query.task
      .where('start', '=', 'someday')
      .where('start_date', 'IS', null)
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('sort_order', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  return (
    <PageContainer>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <ArchiveIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Someday</h1>
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <ArchiveIcon className="size-16 opacity-30" />
        </div>
      )}

      <SortableContext
        items={[{id: 'someday'}]}
        strategy={verticalListSortingStrategy}
      >
        <TaskList tasks={tasks} showDashedCheckbox listData={{id: 'someday'}} />
      </SortableContext>
    </PageContainer>
  )
}
