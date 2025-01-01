import { createContext, useContext, useMemo, useState } from "react";
import {
  DndContext as DndKitContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import { taskStore, uiStore } from "@/stores";
import { TaskItem } from "@/components/TaskList/TaskItem";

interface DragState {
  activeId: UniqueIdentifier | null;
  activeType: "task" | "multiple-tasks" | null;
}

export const DndContext = createContext<{
  isDragging: boolean;
  activeType: DragState["activeType"];
}>({
  isDragging: false,
  activeType: null,
});

export const DndProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [{ activeId, activeType }, setDragState] = useState<DragState>({
      activeId: null,
      activeType: null,
    });

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
      const selectedIds = uiStore.selectedTaskIds;
      const isSelected = selectedIds.includes(active.id as string);

      setDragState({
        activeId: active.id,
        activeType:
          isSelected && selectedIds.length > 1 ? "multiple-tasks" : "task",
      });
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      if (!over) {
        setDragState({ activeId: null, activeType: null });
        return;
      }

      const activeData = active.data.current;
      const overData = over.data.current;

      // Handle dropping on sidebar bucket
      if (overData?.type === "bucket") {
        const tasksToMove =
          activeType === "multiple-tasks"
            ? uiStore.selectedTaskIds
            : [active.id as string];

        taskStore.updateTasksBucket(tasksToMove, over.id as Task["bucket"]);
      }
      // Handle reordering within task list
      else if (activeData?.type === "task" && overData?.type === "task") {
        const tasksToReorder =
          activeType === "multiple-tasks"
            ? uiStore.selectedTaskIds
            : [active.id as string];

        taskStore.reorderTasks(tasksToReorder, over.id as string);
      }

      setDragState({ activeId: null, activeType: null });
    };

    const value = useMemo(
      () => ({
        isDragging: !!activeId,
        activeType,
      }),
      [activeId, activeType],
    );

    return (
      <DndContext.Provider value={value}>
        <DndKitContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {children}
          <DragOverlay>
            {activeId && activeType === "task" && (
              <TaskItem
                task={taskStore.tasks.get(activeId as string)!}
                isSelected={false}
                isDragging
              />
            )}
            {activeId && activeType === "multiple-tasks" && (
              <MultipleTasksOverlay count={uiStore.selectedTaskIds.length} />
            )}
          </DragOverlay>
        </DndKitContext>
      </DndContext.Provider>
    );
  },
);
