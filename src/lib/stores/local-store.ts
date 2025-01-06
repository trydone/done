import {makeAutoObservable} from 'mobx'
import {isHydrated, makePersistable} from 'mobx-persist-store'

import type {RootStore} from './root-store'

export type ButtonState = 'visible' | 'hidden' | 'disabled'

export class LocalStore {
  rootStore: RootStore

  selectedUserId?: string
  selectedWorkspaceId?: string

  // Selection and View States
  selectedTaskIds: string[] = []
  openTaskId: string | null = null
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

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, undefined, {autoBind: true})
    makePersistable(this, {
      name: 'things-local-store',
      properties: ['sidebarCollapsed'],
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    })
    this.rootStore = rootStore
  }

  clearWorkspace() {
    this.selectedUserId = undefined
    this.selectedWorkspaceId = undefined
  }

  changeWorkspace(params: {userId: string; workspaceId: string}) {
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
  setOpenTaskId(openTaskId: string | null) {
    this.openTaskId = openTaskId
    this.updateButtonStates({
      newTask: openTaskId ? 'hidden' : 'visible',
      quickFind: openTaskId ? 'hidden' : 'visible',
      when: openTaskId ? 'hidden' : 'visible',
      move: 'visible',
      delete: openTaskId ? 'visible' : 'hidden',
      moreActions: openTaskId ? 'hidden' : 'visible',
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
