import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {observer} from 'mobx-react-lite'
import {useContext, useMemo} from 'react'

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

function findBorderRadiusGroups(tasks: readonly Task[], selectedIds: string[]) {
  const selectedTasks = tasks
    .filter((task) => selectedIds.includes(task.id))
    .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b))

  const noRadiusTop: string[] = []
  const noRadiusBottom: string[] = []

  selectedTasks.forEach((task, index) => {
    const prevTask = selectedTasks[index - 1]
    const nextTask = selectedTasks[index + 1]

    if (prevTask && tasks.indexOf(task) === tasks.indexOf(prevTask) + 1) {
      noRadiusTop.push(task.id)
    }

    if (nextTask && tasks.indexOf(nextTask) === tasks.indexOf(task) + 1) {
      noRadiusBottom.push(task.id)
    }
  })

  return {noRadiusTop, noRadiusBottom}
}

export const TaskList = observer(({tasks, className, showWhenIcon}: Props) => {
  const {
    localStore: {selectedTaskIds},
  } = useContext(RootStoreContext)

  const {isDragging} = useDndContext()

  const {noRadiusTop, noRadiusBottom} = useMemo(
    () => findBorderRadiusGroups(tasks, selectedTaskIds),
    [tasks, selectedTaskIds],
  )

  console.log({noRadiusTop, noRadiusBottom})

  return (
    <SortableContext
      items={tasks.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        className={cn(
          'flex flex-col',
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
            noRadiusTop={noRadiusTop.includes(task.id)}
            noRadiusBottom={noRadiusBottom.includes(task.id)}
          />
        ))}
      </div>
    </SortableContext>
  )
})
