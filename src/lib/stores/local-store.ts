import {makeAutoObservable} from 'mobx'
import {isHydrated, makePersistable} from 'mobx-persist-store'

import {useZero} from '@/hooks/use-zero'
import {TaskRow} from '@/schema'

import type {RootStore} from './root-store'

export type ButtonState = 'visible' | 'hidden' | 'disabled'

export class LocalStore {
  rootStore: RootStore
  zero: ReturnType<typeof useZero>

  selectedUserId: string | undefined
  selectedWorkspaceId: string | undefined

  // Selection and View States
  selectedTaskIds: Set<string> = new Set()
  lastSelectedTaskId: string | null = null
  openTaskId: string | null = null
  tempTask: TaskRow | null = null
  sidebarCollapsed = false

  // Find State
  quickFindQuery = ''
  quickFindOpen = false

  // When state
  whenState: {
    type: 'single' | 'multiple'
    task?: TaskRow
    immediate?: boolean
  } = {
    type: 'single',
    task: undefined,
  }

  whenOpen = false

  // UI Interaction States
  draggedTaskId: string | null = null
  contextMenuPosition: {x: number; y: number} | null = null

  // Button States
  buttonStates = {
    newTask: 'visible' as ButtonState,
    when: 'disabled' as ButtonState,
    move: 'disabled' as ButtonState,
    quickFind: 'visible' as ButtonState,
    delete: 'hidden' as ButtonState,
    moreActions: 'hidden' as ButtonState,
  }

  constructor(rootStore: RootStore, zero: ReturnType<typeof useZero>) {
    makeAutoObservable(this, undefined, {autoBind: true})
    makePersistable(this, {
      name: 'things-local-store',
      properties: ['sidebarCollapsed'],
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    })
    this.rootStore = rootStore
    this.zero = zero
  }

  setTempTask(task: TaskRow | null) {
    this.tempTask = task
  }

  async commitTempTask() {
    if (this.openTaskId && this.tempTask) {
      await this.zero.mutate.task.update({
        id: this.openTaskId,
        start: this.tempTask.start,
        start_bucket: this.tempTask.start_bucket,
        start_date: this.tempTask.start_date,
      })
      this.tempTask = null
    }
  }

  clearWorkspace() {
    this.selectedUserId = undefined
    this.selectedWorkspaceId = undefined
  }

  changeWorkspace(params: {
    userId: string | undefined
    workspaceId: string | undefined
  }) {
    this.selectedUserId = params.userId
    this.selectedWorkspaceId = params.workspaceId
  }

  // Selection Actions
  setSelectedTaskIds(taskIds: string[]) {
    this.selectedTaskIds = new Set(taskIds)
    this.lastSelectedTaskId = taskIds[taskIds.length - 1] ?? null
    const hasSelection = taskIds.length > 0

    this.updateButtonStates({
      newTask: 'visible',
      when: hasSelection ? 'visible' : 'disabled',
      quickFind: 'visible',
      move: hasSelection ? 'visible' : 'disabled',
      delete: 'hidden',
      moreActions: 'hidden',
    })

    this.setOpenTaskId(null)
  }

  // View Actions
  async setOpenTaskId(openTaskId: string | null) {
    if (this.openTaskId && openTaskId === null) {
      await this.commitTempTask()
    }

    this.openTaskId = openTaskId
    if (openTaskId === null) {
      this.tempTask = null
    }

    this.updateButtonStates({
      newTask: openTaskId ? 'hidden' : 'visible',
      quickFind: openTaskId ? 'hidden' : 'visible',
      when: openTaskId ? 'hidden' : 'disabled',
      move: openTaskId ? 'visible' : 'disabled',
      delete: openTaskId ? 'visible' : 'hidden',
      moreActions: openTaskId ? 'visible' : 'hidden',
    })
  }

  setSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed
  }

  // Find Actions
  setQuickFindQuery(query: string) {
    this.quickFindQuery = query
  }

  setQuickFindOpen(quickFindOpen: boolean) {
    this.quickFindOpen = quickFindOpen
  }

  // When Actions
  setWhenState(whenState: {
    type: 'single' | 'multiple'
    task?: TaskRow
    immediate?: boolean
  }) {
    this.whenState = whenState
  }

  setWhenOpen(whenOpen: boolean) {
    this.whenOpen = whenOpen
  }

  // UI Interaction Actions
  setDraggedTaskId(taskId: string | null) {
    this.draggedTaskId = taskId
  }

  setContextMenuPosition(position: {x: number; y: number} | null) {
    this.contextMenuPosition = position
  }

  // Button State Actions
  updateButtonStates(
    newStates: Partial<{[K in keyof typeof this.buttonStates]: ButtonState}>,
  ) {
    this.buttonStates = {...this.buttonStates, ...newStates}
  }

  toggleTaskSelection(
    id: string,
    isMultiSelect: boolean,
    isRangeSelect: boolean,
    allTaskIds: string[],
  ) {
    this.setOpenTaskId(null)

    if (isRangeSelect && this.lastSelectedTaskId) {
      // Handle range selection logic
      const range = this.getRange(this.lastSelectedTaskId, id, allTaskIds)
      range.forEach((id) => this.selectedTaskIds.add(id))
    } else if (isMultiSelect) {
      // Toggle individual selection
      if (this.selectedTaskIds.has(id)) {
        this.selectedTaskIds.delete(id)
      } else {
        this.selectedTaskIds.add(id)
      }
    } else {
      // Single selection
      this.selectedTaskIds.clear()
      this.selectedTaskIds.add(id)
    }
    this.lastSelectedTaskId = id
  }

  private getRange(
    startId: string,
    endId: string,
    allTaskIds: string[],
  ): string[] {
    const startIndex = allTaskIds.indexOf(startId)
    const endIndex = allTaskIds.indexOf(endId)

    if (startIndex === -1 || endIndex === -1) {
      return []
    }

    // Handle selection in either direction (up or down)
    const start = Math.min(startIndex, endIndex)
    const end = Math.max(startIndex, endIndex)

    return allTaskIds.slice(start, end + 1)
  }

  moveTaskSelection(direction: 'up' | 'down', allTaskIds: string[]) {
    // Guard against empty array
    if (!allTaskIds.length) {
      return
    }

    // If nothing is selected, select the first/last item based on direction
    if (this.selectedTaskIds.size === 0) {
      const newId =
        direction === 'up' ? allTaskIds[allTaskIds.length - 1] : allTaskIds[0]

      if (newId) {
        this.selectedTaskIds.clear()
        this.selectedTaskIds.add(newId)
        this.lastSelectedTaskId = newId
      }

      return
    }

    // Get the current focus point (last selected item)
    const currentId =
      this.lastSelectedTaskId ?? Array.from(this.selectedTaskIds)[0]
    if (!currentId) {
      return
    }

    const currentIndex = allTaskIds.indexOf(currentId)
    if (currentIndex === -1) {
      return
    }

    const newIndex =
      direction === 'up'
        ? currentIndex === 0
          ? allTaskIds.length - 1
          : currentIndex - 1
        : currentIndex === allTaskIds.length - 1
          ? 0
          : currentIndex + 1

    const newId = allTaskIds[newIndex]
    if (!newId) {
      return
    }

    // Check if shift key is held (assuming we pass this as a parameter if needed)
    const isShiftHeld = false // This should be passed as a parameter if needed

    if (isShiftHeld) {
      // Add to existing selection
      this.selectedTaskIds.add(newId)
    } else {
      // Replace selection
      this.selectedTaskIds.clear()
      this.selectedTaskIds.add(newId)
    }

    this.lastSelectedTaskId = newId
  }

  // Computed Properties
  get isHydrated() {
    return isHydrated(this)
  }
}
