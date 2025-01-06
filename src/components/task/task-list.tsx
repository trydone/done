import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {observer} from 'mobx-react-lite'
import {useContext} from 'react'

import {RootStoreContext} from '@/lib/stores/root-store'
import {cn} from '@/lib/utils'

import {useDndContext} from '../dnd/dnd-context'
import {TaskItemWrapper} from './task-item-wrapper'
import {Task} from './types'

type Props = {
  tasks: readonly Task[]
  className?: string
  showWhenIcon?: boolean
}

export const TaskList = observer(({tasks, className, showWhenIcon}: Props) => {
  const {
    localStore: {selectedTaskIds},
  } = useContext(RootStoreContext)

  const {isDragging} = useDndContext()

  return (
    <SortableContext
      items={tasks.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        className={cn(
          'flex flex-col gap-1',
          isDragging && 'cursor-grabbing',
          className,
        )}
      >
        {tasks.map((task) => (
          <TaskItemWrapper
            key={task.id}
            task={task}
            isSelected={selectedTaskIds.includes(task.id)}
            showWhenIcon={showWhenIcon}
          />
        ))}
      </div>
    </SortableContext>
  )
})
