import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {observer} from 'mobx-react-lite'
import {MouseEvent, useContext} from 'react'

import {RootStoreContext} from '@/lib/stores/root-store'
import {cn} from '@/lib/utils'

import {DndListData, useDndContext} from '../dnd/dnd-context'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu'
import {TaskItemContent} from './task-item-content'
import {Task} from './types'
import {WhenHoverButton} from './when-hover-button'

type Props = {
  task: Task
  isDragging?: boolean
  isSelected?: boolean
  showWhenIcon?: boolean
  showDashedCheckbox?: boolean
  onComplete?: (checked: boolean) => void
  onArchive?: (archived: boolean) => void
  checked: boolean
  className?: string
  noRadiusTop?: boolean
  noRadiusBottom?: boolean
  listData: DndListData
  isOverlay?: boolean
  onClick: (e: MouseEvent<HTMLDivElement>) => void
}

export const TaskItem = observer(
  ({
    task,
    isDragging: isOverlayDragging,
    isSelected,
    showWhenIcon,
    showDashedCheckbox,
    onComplete,
    onArchive,
    checked,
    className,
    noRadiusTop,
    noRadiusBottom,
    listData,
    isOverlay,
    onClick,
  }: Props) => {
    const {
      localStore: {setSelectedTaskIds, setOpenTaskId},
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
        listData,
      },
    })

    const isDragging = isOverlayDragging || isSortableDragging

    const isDraggingMultiple = isContextDragging && isSelected && !isDragging

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setSelectedTaskIds([])
      setOpenTaskId(task.id)
    }

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="relative mx-2 select-none">
            <div className="absolute left-0 top-[2px] -translate-x-full">
              <WhenHoverButton task={task} />
            </div>

            <div
              ref={setNodeRef}
              style={style}
              {...attributes}
              {...listeners}
              className={cn(
                'group relative flex items-center gap-2 rounded-lg px-2 py-1 outline-0 transition-all duration-200 ease-in-out',
                {
                  'bg-[#CBE2FF] dark:bg-[#244174]':
                    !isDragging &&
                    !isDraggingMultiple &&
                    (isSelected || isOverlay),
                  'shadow-lg': isOverlay,
                  '!rounded-t-none':
                    noRadiusTop && !isDragging && !isDraggingMultiple,
                  '!rounded-b-none':
                    noRadiusBottom && !isDragging && !isDraggingMultiple,
                  'overflow-hidden': isDragging || isDraggingMultiple,
                  'opacity-50': isDraggingMultiple,
                },
                className,
              )}
              onClick={onClick}
              onDoubleClick={handleDoubleClick}
            >
              <TaskItemContent
                task={task}
                onComplete={onComplete}
                checked={checked}
                showWhenIcon={showWhenIcon}
                showDashedCheckbox={showDashedCheckbox}
              />

              {isDragging && (
                <div className="absolute inset-0 z-10 bg-sidebar-accent" />
              )}

              {isDraggingMultiple && (
                <div className="absolute inset-0 z-10 bg-sidebar-accent/50" />
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => onComplete?.(!checked)}>
            {checked ? 'Mark as incomplete' : 'Mark as complete'}
          </ContextMenuItem>

          <ContextMenuItem onClick={() => onArchive?.(!task?.archived_at)}>
            {task?.archived_at ? 'Put back' : 'Delete To-Do'}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  },
)
