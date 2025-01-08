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
  selectedTaskIds: string[] = []
  openTaskId: string | null = null
  tempTask: TaskRow | null = null
  sidebarCollapsed = false

  // Find State
  quickFindQuery = ''
  quickFindOpen = false

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
    this.selectedTaskIds = taskIds
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

  // Find Actions
  setQuickFindOpen(quickFindOpen: boolean) {
    this.quickFindOpen = quickFindOpen
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

  // Computed Properties
  get isHydrated() {
    return isHydrated(this)
  }

  get hasSelectedTask() {
    return this.selectedTaskIds.length > 0
  }

  get isDragging() {
    return this.draggedTaskId !== null
  }

  get hasContextMenu() {
    return this.contextMenuPosition !== null
  }
}
