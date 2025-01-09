'use client'

import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import {BookCheckIcon} from 'lucide-react'
import {observer} from 'mobx-react-lite'

import {PageContainer} from '@/components/shared/page-container'
import {TaskList} from '@/components/task/task-list'
import {useTaskSelection} from '@/hooks/use-task-selection'
import {useZero} from '@/hooks/use-zero'

const Page = observer(() => {
  const zero = useZero()

  const [tasks] = useQuery(
    zero.query.task
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS NOT', null)
      .orderBy('completed_at', 'asc')
      .related('tags', (q) => q.orderBy('updated_at', 'desc'))
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  const {handleClick} = useTaskSelection(tasks.map((task) => task.id))

  return (
    <PageContainer>
      <div className="task-outside-click mx-4 flex items-center gap-2">
        <BookCheckIcon className="task-outside-click size-6" />
        <h1 className="h3 task-outside-click">Logbook</h1>
      </div>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <BookCheckIcon className="size-16 opacity-30" />
        </div>
      )}

      <SortableContext
        items={[{id: 'logbook'}]}
        strategy={verticalListSortingStrategy}
      >
        <TaskList
          tasks={tasks}
          listData={{id: 'logbook'}}
          onTaskClick={handleClick}
        />
      </SortableContext>
    </PageContainer>
  )
})

export default Page
