'use client'
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import {TrashIcon} from 'lucide-react'
import {useCallback} from 'react'

import {PageContainer} from '@/components/shared/page-container'
import {Section} from '@/components/shared/section'
import {TaskList} from '@/components/task/task-list'
import {Button} from '@/components/ui/button'
import {useZero} from '@/hooks/use-zero'

export default function PageTrash() {
  return (
    <PageContainer>
      <SectionTrash />
    </PageContainer>
  )
}

const SectionTrash = () => {
  const zero = useZero()

  const [tasks] = useQuery(
    zero.query.task
      .where('archived_at', 'IS NOT', null)
      .orderBy('archived_at', 'asc')
      .related('tags', (q) => q.orderBy('updated_at', 'desc'))
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  const handleEmptyTrash = useCallback(() => {
    // Loop through each task and delete it
    ;(tasks || []).forEach((task) => {
      zero.mutate.task.delete({
        id: task.id,
      })
    })
  }, [tasks, zero.mutate.task])

  return (
    <Section>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <TrashIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Trash</h1>
      </div>

      {tasks.length === 0 ? (
        <div className="task-outside-click flex items-center justify-center py-10">
          <TrashIcon className="task-outside-click size-16 opacity-30" />
        </div>
      ) : (
        <div className="mx-4">
          <Button onClick={handleEmptyTrash} size="xs" variant="destructive">
            Empty Trash
          </Button>
        </div>
      )}

      <SortableContext
        items={[{id: 'trash'}]}
        strategy={verticalListSortingStrategy}
      >
        <TaskList tasks={tasks} listData={{id: 'trash'}} />
      </SortableContext>
    </Section>
  )
}
