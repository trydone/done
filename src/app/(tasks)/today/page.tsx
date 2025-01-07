'use client'

import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import {MoonIcon, StarIcon} from 'lucide-react'

import {useDndContext} from '@/components/dnd/dnd-context'
import {PageContainer} from '@/components/shared/page-container'
import {TaskList} from '@/components/task/task-list'
import {useZero} from '@/hooks/use-zero'

export default function Page() {
  const {dragOverId, activeId} = useDndContext()

  const zero = useZero()

  const [tasks] = useQuery(
    zero.query.task
      .where('start', '=', 'started')
      .where('start_date', 'IS NOT', null)
      .where('archived_at', 'IS', null)
      .where('completed_at', 'IS', null)
      .orderBy('sort_order', 'asc')
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc')),
  )

  const todayTasks = tasks.filter((task) => {
    if (dragOverId && task.id === activeId) {
      // Show dragged task in the list it's over
      return dragOverId === 'today'
    }
    return task.start_bucket !== 'evening'
  })

  const initialEveningTasks = tasks.filter(
    (task) => task.start_bucket === 'evening',
  )

  const eveningTasks = tasks.filter((task) => {
    if (dragOverId && task.id === activeId) {
      return dragOverId === 'evening'
    }
    return task.start_bucket === 'evening'
  })

  return (
    <PageContainer>
      <div>
        <div className="task-outside-click mx-4 flex items-center gap-2">
          <StarIcon className="task-outside-click size-6" />
          <h1 className="h3 task-outside-click">Today</h1>
        </div>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <StarIcon className="size-16 opacity-30" />
          </div>
        )}
      </div>

      <SortableContext
        items={[{id: 'today'}, {id: 'evening'}]}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col">
          <TaskList
            tasks={todayTasks}
            listData={{id: 'today', start: 'started', start_bucket: 'today'}}
          />

          {initialEveningTasks.length > 0 && (
            <>
              <div className="mx-4 mt-6">
                <div className="task-outside-click flex items-center gap-2 border-b border-border py-1">
                  <MoonIcon className="task-outside-click size-4" />
                  <h1 className="task-outside-click text-base font-bold tracking-tight">
                    This Evening
                  </h1>
                </div>
              </div>
              <TaskList
                tasks={eveningTasks}
                listData={{
                  id: 'evening',
                  start: 'started',
                  start_bucket: 'evening',
                }}
              />
            </>
          )}
        </div>
      </SortableContext>
    </PageContainer>
  )
}
