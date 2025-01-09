import {
  DndContext as DndKitContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
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

export type DndListData = {
  id: string
  start_bucket?: string
  start_date?: number | null
  start?: string
  archived_at?: number | null
  completed_at?: number | null
}

interface DragState {
  activeId: UniqueIdentifier | null
  activeType: 'task' | 'multiple-tasks' | null
}

export const DndContext = createContext<{
  isDragging: boolean
  activeType: DragState['activeType']
  dragOverId: string | null
  activeId: DragState['activeId']
}>({
  isDragging: false,
  activeType: null,
  dragOverId: null,
  activeId: null,
})

export const DndProvider = observer(({children}: {children: ReactNode}) => {
  const {
    localStore: {selectedTaskIds},
  } = useContext(RootStoreContext)

  const [isOverSidebar, setIsOverSidebar] = useState(false)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const zero = useZero()

  const [{activeId, activeType}, setDragState] = useState<DragState>({
    activeId: null,
    activeType: null,
  })

  const [activeTask] = useQuery(
    zero.query.task
      .where('id', '=', activeId as string)
      .related('tags', (q) => q.orderBy('updated_at', 'desc'))
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
  )

  const updateTask = async (task: Partial<TaskRow>) => {
    await zero.mutate.task.update({
      ...task,
    })
  }

  const rebalanceBucket = async (tasksInBucket: TaskRow[]) => {
    const updates = tasksInBucket.map((task, index) => ({
      ...task,
      sort_order: (index + 1) * INITIAL_GAP,
    }))

    for (const update of updates) {
      await updateTask(update)
    }
  }

  const handleBucketTransition = async ({
    taskIds,
    bucketId,
    overId,
    activeId,
  }: {
    taskIds: string[]
    bucketId: string
    overId: string
    activeId: string
  }) => {
    let start: string
    let start_date: number | null
    let start_bucket: string = 'today'
    let archived_at: number | null
    let completed_at: number | null

    const paths = bucketId.split('-')
    const id = paths[0]!
    const idDate = paths?.[1] ? parseInt(paths[1]) : null

    switch (id) {
      case 'today':
        start = 'started'
        start_date = startOfDay(new Date()).getTime()
        archived_at = null
        completed_at = null
        break
      case 'evening':
        start_bucket = 'evening'
        start = 'started'
        start_date = startOfDay(new Date()).getTime()
        archived_at = null
        completed_at = null
        break
      case 'anytime':
        start = 'started'
        archived_at = null
        completed_at = null
        break
      case 'upcoming':
        start = 'started'
        start_date = idDate ?? addDays(startOfDay(new Date()), 1).getTime()
        archived_at = null
        completed_at = null
        break
      case 'someday':
        start = 'someday'
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
        start_date = null
        archived_at = null
        completed_at = null
        break
    }

    const tomorrow = addDays(startOfDay(new Date()), 1).getTime()

    // Get current tasks in target bucket with proper filtering
    const tasksInBucket = allTasks.filter((task) => {
      switch (id) {
        case 'today':
          return (
            task.start === 'started' &&
            task.start_bucket === 'today' &&
            !!task.start_date &&
            task.start_date < tomorrow &&
            !task.archived_at &&
            !task.completed_at
          )
        case 'evening':
          return (
            task.start === 'started' &&
            task.start_bucket === 'evening' &&
            !!task.start_date &&
            task.start_date < tomorrow &&
            !task.archived_at &&
            !task.completed_at
          )
        case 'anytime':
          return (
            task.start === 'started' &&
            (task.start_date === null || task.start_date < tomorrow) &&
            !task.archived_at &&
            !task.completed_at
          )
        case 'upcoming':
          return (
            task.start === 'started' &&
            task.start_bucket === 'today' &&
            !!task.start_date &&
            task.start_date >= tomorrow &&
            !task.archived_at &&
            !task.completed_at
          )
        case 'someday':
          return (
            task.start === 'someday' &&
            task.start_bucket === 'today' &&
            task.start_date === null &&
            !task.archived_at &&
            !task.completed_at
          )
        case 'inbox':
          return (
            task.start === 'not_started' &&
            task.start_bucket === 'today' &&
            task.start_date === null &&
            !task.archived_at &&
            !task.completed_at
          )
        case 'logbook':
          return !!task.completed_at
        case 'trash':
          return !!task.archived_at
        default:
          return false
      }
    })

    // Get and sort selected tasks
    const selectedTasks = allTasks
      .filter((task) => taskIds.includes(task.id))
      .sort((a, b) => {
        if (a.id === activeId) return -1
        if (b.id === activeId) return 1
        return a.sort_order - b.sort_order
      })

    const updatedTasks = selectedTasks.map((task) => ({
      id: task.id,
      start_bucket,
      start,
      start_date,
      completed_at,
      archived_at,
    }))

    // Reorder tasks in target bucket
    const remainingTasks = tasksInBucket.filter(
      (task) => !taskIds.includes(task.id),
    )

    const selectedWithoutActive = taskIds.filter((id) => id !== activeId)

    const overIndex = tasksInBucket
      .filter((task) => !selectedWithoutActive.includes(task.id))
      .findIndex((task) => task.id === overId)

    const orderedTasks =
      overIndex === -1
        ? [...remainingTasks, ...updatedTasks]
        : [
            ...remainingTasks.slice(0, overIndex),
            ...updatedTasks,
            ...remainingTasks.slice(overIndex),
          ]

    await rebalanceBucket(orderedTasks as any)
  }

  const handleDragStart = ({active}: DragStartEvent) => {
    const isSelected = selectedTaskIds.has(active.id as string)
    setDragState({
      activeId: active.id,
      activeType:
        isSelected && selectedTaskIds.size > 1 ? 'multiple-tasks' : 'task',
    })
  }

  const handleDragOver = ({over}: DragOverEvent) => {
    if (!over) {
      setIsOverSidebar(false)
      setDragOverId(null)
      return
    }

    const overData = over.data.current as {type: string; listData?: DndListData}

    // Check if dragging over sidebar container
    setIsOverSidebar(['sidebar', 'bucket'].includes(overData?.type || ''))

    setDragOverId(overData?.listData?.id || null)
  }

  const handleDragEnd = async ({active, over}: DragEndEvent) => {
    if (!over) {
      setDragState({activeId: null, activeType: null})
      return
    }

    const activeData = active.data.current as {
      type: string
      listData?: DndListData
    }
    const overData = over.data.current as {type: string; listData?: DndListData}

    try {
      const taskIds =
        activeType === 'multiple-tasks'
          ? selectedTaskIds
          : [active.id as string]

      const bucketId = overData?.listData?.id || ''
      const overId = over.id as string
      const activeId = active.id as string

      if (overData?.type === 'bucket') {
        await handleBucketTransition({taskIds, bucketId, overId, activeId})
      } else if (activeData?.type === 'task' && overData?.type === 'task') {
        await handleBucketTransition({taskIds, bucketId, overId, activeId})
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during drag operation:', error)
    }

    setDragState({activeId: null, activeType: null})
  }

  const value = useMemo(
    () => ({
      isDragging: !!activeId,
      activeType,
      activeId,
      dragOverId,
    }),
    [activeId, activeType, dragOverId],
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
                    activeType === 'multiple-tasks' ? selectedTaskIds.size : 1
                  }
                />
              ) : (
                activeTask && (
                  <TaskItem
                    task={activeTask}
                    isOverlay
                    checked={!!activeTask.completed_at}
                    listData={{id: ''}}
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
