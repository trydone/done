import {
  DndContext as DndKitContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useQuery } from '@rocicorp/zero/react'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import { useZero } from '@/hooks/use-zero'
import { INITIAL_GAP } from '@/lib/constants'
import { RootStoreContext } from '@/lib/stores/root-store'
import { TaskRow } from '@/schema'

import { MultipleTasksOverlay } from '../task/multiple-task-overlay'
import { TaskItem } from '../task/task-item'

interface DragState {
  activeId: UniqueIdentifier | null
  activeType: 'task' | 'multiple-tasks' | null
}

export const DndContext = createContext<{
  isDragging: boolean
  activeType: DragState['activeType']
}>({
  isDragging: false,
  activeType: null,
})

export const DndProvider = observer(({ children }: { children: ReactNode }) => {
  const {
    localStore: { selectedTaskIds },
  } = useContext(RootStoreContext)

  const zero = useZero()

  const [{ activeId, activeType }, setDragState] = useState<DragState>({
    activeId: null,
    activeType: null,
  })

  const [activeTask] = useQuery(
    zero.query.task
      .where('id', '=', activeId as string)
      .related('tags')
      .related('checklistItems', (q) => q.orderBy('sort_order', 'asc'))
      .one(),
    !!activeId,
  )

  const [allTasks] = useQuery(zero.query.task.orderBy('sort_order', 'asc'))

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const updateTask = async (task: Partial<TaskRow>) => {
    await zero.mutate.task.update({
      id: task.id,
      title: task.title,
      sort_order: task.sort_order,
      start_bucket: task.start_bucket,
    })
  }

  const rebalanceBucket = async (bucketTasks: TaskRow[]) => {
    const updates = bucketTasks.map((task, index) => ({
      id: task.id,
      sort_order: (index + 1) * INITIAL_GAP,
    }))

    for (const update of updates) {
      await updateTask(update)
    }
  }

  const updateTasksBucket = async (taskIds: string[], newBucket: string) => {
    // Get current tasks in target bucket
    const tasksInBucket = allTasks.filter((t) => t.start_bucket === newBucket)

    // Move selected tasks to front
    const movedTasks = taskIds.map((id, index) => ({
      id,
      sort_order: -1 * (taskIds.length - index) * INITIAL_GAP,
      start_bucket: newBucket,
    }))

    // Update tasks
    for (const task of movedTasks) {
      await updateTask(task)
    }

    // Rebalance if needed
    if (tasksInBucket.length > 0) {
      await rebalanceBucket([...movedTasks, ...tasksInBucket])
    }
  }

  const reorderTasks = async (taskIds: string[], targetId: string) => {
    const targetTask = allTasks.find((t) => t.id === targetId)
    if (!targetTask) return

    // Get all tasks in the same bucket
    const bucketTasks = allTasks.filter(
      (t) => t.start_bucket === targetTask.start_bucket,
    )
    const targetIndex = bucketTasks.findIndex((t) => t.id === targetId)

    // Remove tasks being moved
    const remainingTasks = bucketTasks.filter((t) => !taskIds.includes(t.id))

    // Insert tasks at target position
    const orderedTasks = [
      ...remainingTasks.slice(0, targetIndex),
      ...taskIds.map((id) => bucketTasks.find((t) => t.id === id)!),
      ...remainingTasks.slice(targetIndex),
    ]

    // Rebalance entire bucket
    await rebalanceBucket(orderedTasks)
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const isSelected = selectedTaskIds.includes(active.id as string)
    setDragState({
      activeId: active.id,
      activeType:
        isSelected && selectedTaskIds.length > 1 ? 'multiple-tasks' : 'task',
    })
  }

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) {
      setDragState({ activeId: null, activeType: null })
      return
    }

    const activeData = active.data.current as { type?: string }
    const overData = over.data.current as { type?: string }

    try {
      if (overData?.type === 'bucket') {
        const tasksToMove =
          activeType === 'multiple-tasks'
            ? selectedTaskIds
            : [active.id as string]
        await updateTasksBucket(tasksToMove, over.id as string)
      } else if (activeData?.type === 'task' && overData?.type === 'task') {
        const tasksToReorder =
          activeType === 'multiple-tasks'
            ? selectedTaskIds
            : [active.id as string]
        await reorderTasks(tasksToReorder, over.id as string)
      }
    } catch (error) {
      console.error('Error during drag operation:', error)
    }

    setDragState({ activeId: null, activeType: null })
  }

  const value = useMemo(
    () => ({
      isDragging: !!activeId,
      activeType,
    }),
    [activeId, activeType],
  )

  return (
    <DndContext.Provider value={value}>
      <DndKitContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
        <DragOverlay>
          {activeId && activeType === 'task' && activeTask && (
            <TaskItem task={activeTask} isSelected={false} isDragging />
          )}
          {activeId && activeType === 'multiple-tasks' && (
            <MultipleTasksOverlay count={selectedTaskIds.length} />
          )}
        </DragOverlay>
      </DndKitContext>
    </DndContext.Provider>
  )
})

export function useDndContext() {
  const context = useContext(DndContext)
  if (!context) {
    throw new Error('useDndContext must be used within a DndProvider')
  }
  return context
}
