import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { RootStore } from "./root-store";

export class LocalStore {
  rootStore: RootStore;

  selectedUserId?: string;
  selectedWorkspaceId?: string;

  // Selection and View States
  selectedTaskIds: string[] = [];
  openTaskId: string | null = null;
  sidebarCollapsed = false;

  // Search State
  quickSearchQuery = "";
  quickSearchActive = false;

  // UI Interaction States
  draggedTaskId: string | null = null;
  contextMenuPosition: { x: number; y: number } | null = null;
  completionAnimationTasks: Set<string> = new Set();
  checklistExpanded: Record<string, boolean> = {};

  // Button States
  buttonStates = {
    newTask: true,
    move: false,
    quickSearch: true,
    delete: false,
    repeat: false,
    duplicate: false,
    convertToProject: false,
    share: false,
  };

  // User Preferences
  userPreferences = {
    showCompletedTasks: false,
    showChecklistProgress: true,
    sortOrder: "manual" as "manual" | "deadline" | "title",
  };

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, undefined, { autoBind: true });
    makePersistable(this, {
      name: "things-local-store",
      properties: ["sidebarCollapsed", "userPreferences", "checklistExpanded"],
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    });
    this.rootStore = rootStore;
  }

  clearWorkspace() {
    this.selectedUserId = undefined;
    this.selectedWorkspaceId = undefined;
  }

  changeWorkspace(params: { userId: string; workspaceId: string }) {
    this.selectedUserId = params.userId;
    this.selectedWorkspaceId = params.workspaceId;
  }

  // Selection Actions
  setSelectedTaskIds(taskIds: string[]) {
    this.selectedTaskIds = taskIds;
    if (taskIds) {
      this.updateButtonStates({
        move: true,
        delete: true,
        repeat: true,
        duplicate: true,
        convertToProject: true,
        share: true,
      });
    } else {
      this.updateButtonStates({
        move: false,
        delete: false,
        repeat: false,
        duplicate: false,
        convertToProject: false,
        share: false,
      });
    }
  }

  // View Actions
  setOpenTaskId(openTaskId: string | null) {
    this.openTaskId = openTaskId;
    this.updateButtonStates({
      newTask: !openTaskId,
      quickSearch: !openTaskId,
    });
  }

  setSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  // Search Actions
  setQuickSearchQuery(query: string) {
    this.quickSearchQuery = query;
    this.quickSearchActive = query.length > 0;
  }

  // UI Interaction Actions
  setDraggedTaskId(taskId: string | null) {
    this.draggedTaskId = taskId;
  }

  setContextMenuPosition(position: { x: number; y: number } | null) {
    this.contextMenuPosition = position;
  }

  startTaskCompletionAnimation(taskId: string) {
    this.completionAnimationTasks.add(taskId);
    setTimeout(() => {
      this.completionAnimationTasks.delete(taskId);
      this.setSelectedTaskIds(
        this.selectedTaskIds.filter((id) => id !== taskId)
      );
    }, 5000);
  }

  toggleChecklistExpanded(taskId: string) {
    this.checklistExpanded[taskId] = !this.checklistExpanded[taskId];
  }
  // Button State Actions
  updateButtonStates(newStates: Partial<typeof this.buttonStates>) {
    this.buttonStates = { ...this.buttonStates, ...newStates };
  }

  // Preference Actions
  updateUserPreferences(newPrefs: Partial<typeof this.userPreferences>) {
    this.userPreferences = { ...this.userPreferences, ...newPrefs };
  }

  // Computed Properties
  get isHydrated() {
    return isHydrated(this);
  }

  get hasSelectedTask() {
    return this.selectedTaskIds.length > 0;
  }

  get isSearching() {
    return this.quickSearchActive;
  }

  get isDragging() {
    return this.draggedTaskId !== null;
  }

  get hasContextMenu() {
    return this.contextMenuPosition !== null;
  }

  // Reset State
  reset() {
    this.selectedTaskIds = [];
    this.openTaskId = null;
    this.quickSearchQuery = "";
    this.quickSearchActive = false;
    this.draggedTaskId = null;
    this.contextMenuPosition = null;
    this.completionAnimationTasks.clear();
    this.buttonStates = {
      newTask: true,
      move: false,
      quickSearch: true,
      delete: false,
      repeat: false,
      duplicate: false,
      convertToProject: false,
      share: false,
    };
  }
}
