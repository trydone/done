import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {observer} from 'mobx-react-lite'
import {MouseEvent, useContext} from 'react'

import {RootStoreContext} from '@/lib/stores/root-store'
import {cn} from '@/lib/utils'

import {useDndContext} from '../dnd/dnd-context'
import {TaskItemContent} from './task-item-content'
import {Task} from './types'

type Props = {
  task: Task
  isDragging?: boolean
  isSelected?: boolean
  showWhenIcon?: boolean
  onComplete?: (checked: boolean) => void
  checked: boolean
  className?: string
  noRadiusTop?: boolean
  noRadiusBottom?: boolean
}

export const TaskItem = observer(
  ({
    task,
    isDragging: isOverlayDragging,
    isSelected,
    showWhenIcon,
    onComplete,
    checked,
    className,
    noRadiusTop,
    noRadiusBottom,
  }: Props) => {
    const {
      localStore: {selectedTaskIds, setSelectedTaskIds, setOpenTaskId},
    } = useContext(RootStoreContext)
    const {isDragging: isContextDragging} = useDndContext()
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isSortableDragging,
    } = useSortable({
      id: task.id,
      data: {
        type: 'task',
        task,
      },
    })

    const isDragging = isOverlayDragging || isSortableDragging
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (e.metaKey || e.ctrlKey) {
        const isSelected = selectedTaskIds.includes(task.id)
        const newSelected = isSelected
          ? selectedTaskIds.filter((id) => id !== task.id)
          : [...selectedTaskIds, task.id]
        setSelectedTaskIds(newSelected)
      } else {
        setSelectedTaskIds([task.id])
      }
    }

    const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setSelectedTaskIds([])
      setOpenTaskId(task.id)
    }

    return (
      <div className="mx-2">
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={cn(
            'group relative flex items-center gap-2 rounded-lg p-2 transition-all duration-200 ease-in-out',
            {
              'bg-blue-200 dark:bg-blue-800': isSelected,
              'shadow-lg': isDragging,
              'opacity-50': isContextDragging && !isSelected,
              '!rounded-t-none': noRadiusTop,
              '!rounded-b-none': noRadiusBottom,
            },
            className,
          )}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <TaskItemContent
            task={task}
            onComplete={onComplete}
            checked={checked}
            showWhenIcon={showWhenIcon}
          />
        </div>
      </div>
    )
  },
)
