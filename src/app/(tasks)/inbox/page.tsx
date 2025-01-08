'use client'

import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import {InboxIcon} from 'lucide-react'

import {PageContainer} from '@/components/shared/page-container'
import {TaskList} from '@/components/task/task-list'
import {useZero} from '@/hooks/use-zero'

export default function Page() {
  const zero = useZero()

  const [tasks] = useQuery(
    zero.query.task
      .where('start', '=', 'not_started')
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('sort_order', 'asc')
      .related('tags', (q) => q.orderBy('updated_at', 'desc'))
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  return (
    <PageContainer>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <InboxIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Inbox</h1>
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <InboxIcon className="size-16 opacity-30" />
        </div>
      )}

      <SortableContext
        items={[{id: 'inbox'}]}
        strategy={verticalListSortingStrategy}
      >
        <TaskList tasks={tasks} listData={{id: 'inbox'}} />
      </SortableContext>
    </PageContainer>
  )
}
