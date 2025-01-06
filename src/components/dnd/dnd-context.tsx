import {
  DndContext as DndKitContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable'
import {useQuery} from '@rocicorp/zero/react'
import {addDays, startOfDay} from 'date-fns'
import _ from 'lodash'
import {observer} from 'mobx-react-lite'
import {createContext, ReactNode, useContext, useMemo, useState} from 'react'

import {useZero} from '@/hooks/use-zero'
import {INITIAL_GAP} from '@/lib/constants'
import {RootStoreContext} from '@/lib/stores/root-store'
import {TaskRow} from '@/schema'

import {MultipleTasksOverlay} from '../task/multiple-task-overlay'
import {TaskItem} from '../task/task-item'

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

export const DndProvider = observer(({children}: {children: ReactNode}) => {
  const {
    localStore: {selectedTaskIds},
  } = useContext(RootStoreContext)

  const [isOverSidebar, setIsOverSidebar] = useState(false)

  const zero = useZero()

  const [{activeId, activeType}, setDragState] = useState<DragState>({
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
    useSensor(PointerSensor, {
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
      ...task,
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

  const handleBucketTransition = async (
    taskIds: string[],
    targetBucket: string,
  ) => {
    let start: string
    let start_date: number | null
    let start_bucket: string = targetBucket
    let archived_at: number | null
    let completed_at: number | null

    // Define bucket transition logic
    switch (targetBucket) {
      case 'today':
      case 'today-list':
        start = 'started'
        start_bucket = 'today'
        start_date = startOfDay(new Date()).getTime()
        archived_at = null
        completed_at = null
        break
      case 'evening-list':
        start = 'started'
        start_bucket = 'evening'
        start_date = startOfDay(new Date()).getTime()
        archived_at = null
        completed_at = null
        break
      case 'anytime':
        start = 'started'
        start_bucket = 'today'
        start_date = null
        archived_at = null
        completed_at = null
        break
      case 'upcoming':
        start = 'postponed'
        start_bucket = 'today'
        start_date = addDays(startOfDay(new Date()), 1).getTime()
        archived_at = null
        completed_at = null
        break
      case 'someday':
        start = 'postponed'
        start_bucket = 'today'
        start_date = null
        archived_at = null
        completed_at = null
        break
      case 'logbook':
        completed_at = new Date().getTime()
        break
      case 'trash':
        archived_at = new Date().getTime()
        break
      case 'inbox':
      default:
        start = 'not_started'
        start_bucket = 'today'
        start_date = null
        archived_at = null
        completed_at = null
        break
    }

    const todayStartTime = startOfDay(new Date()).getTime()
    const tomorrowStartTime = addDays(startOfDay(new Date()), 1).getTime()

    // Get current tasks in target bucket with proper filtering
    const tasksInBucket = allTasks.filter((task) => {
      // Exclude the tasks being moved from the current bucket tasks
      if (taskIds.includes(task.id)) {
        return false
      }

      switch (targetBucket) {
        case 'today':
        case 'today-list':
          return (
            task.start === 'started' &&
            task.start_bucket === 'today' &&
            task.start_date === todayStartTime
          )
        case 'evening-list':
          return (
            task.start === 'started' &&
            task.start_bucket === 'evening' &&
            task.start_date === todayStartTime
          )
        case 'anytime':
          return (
            task.start === 'started' &&
            task.start_bucket === 'today' &&
            task.start_date === null
          )
        case 'upcoming':
          return (
            task.start === 'postponed' &&
            task.start_bucket === 'today' &&
            task.start_date !== null &&
            task.start_date >= tomorrowStartTime
          )
        case 'someday':
          return (
            task.start === 'postponed' &&
            task.start_bucket === 'today' &&
            task.start_date === null
          )
        case 'inbox':
          return (
            task.start === 'not_started' &&
            task.start_bucket === 'today' &&
            task.start_date === null
          )
        default:
          return false
      }
    })

    // Move selected tasks to front with updated properties
    const movedTasks = taskIds.map((id, index) => ({
      id,
      sort_order: -1 * (taskIds.length - index) * INITIAL_GAP,
      start_bucket,
      start,
      start_date,
      completed_at,
      archived_at,
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

  const handleDragStart = ({active}: DragStartEvent) => {
    const isSelected = selectedTaskIds.includes(active.id as string)
    setDragState({
      activeId: active.id,
      activeType:
        isSelected && selectedTaskIds.length > 1 ? 'multiple-tasks' : 'task',
    })
  }

  const handleDragEnd = async ({active, over}: DragEndEvent) => {
    if (!over) {
      setDragState({activeId: null, activeType: null})
      return
    }

    const activeData = active.data.current as {type?: string}
    const overData = over.data.current as {type?: string}

    try {
      if (['bucket', 'list'].includes(overData?.type || '')) {
        const tasksToMove =
          activeType === 'multiple-tasks'
            ? selectedTaskIds
            : [active.id as string]
        await handleBucketTransition(tasksToMove, over.id as string)
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

    setDragState({activeId: null, activeType: null})
  }

  const handleDragOver = ({over}: DragOverEvent) => {
    if (!over) {
      setIsOverSidebar(false)
      return
    }

    // Check if dragging over sidebar container
    setIsOverSidebar(
      ['sidebar', 'bucket'].includes(
        (over?.data?.current as {type?: string})?.type || '',
      ),
    )
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
        onDragOver={handleDragOver}
        collisionDetection={pointerWithin}
      >
        {children}
        <DragOverlay>
          {activeId && (
            <>
              {isOverSidebar || activeType === 'multiple-tasks' ? (
                <MultipleTasksOverlay
                  count={
                    activeType === 'multiple-tasks' ? selectedTaskIds.length : 1
                  }
                />
              ) : (
                activeTask && (
                  <TaskItem
                    task={activeTask}
                    isSelected={false}
                    isDragging
                    checked={!!activeTask.completed_at}
                  />
                )
              )}
            </>
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
