import { createContext, ReactNode, useContext, useMemo, useState } from "react";
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
import { RootStoreContext } from "@/lib/stores/root-store";
import { TaskItem } from "../task/task-item";
import { MultipleTasksOverlay } from "../task/multiple-tasl-overlay";

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

export const DndProvider = observer(({ children }: { children: ReactNode }) => {
  const {
    localStore: { selectedTaskIds },
  } = useContext(RootStoreContext);

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
    const selectedIds = selectedTaskIds;
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
          ? selectedTaskIds
          : [active.id as string];

      updateTasksBucket(tasksToMove, over.id as Task["bucket"]);
    }
    // Handle reordering within task list
    else if (activeData?.type === "task" && overData?.type === "task") {
      const tasksToReorder =
        activeType === "multiple-tasks"
          ? selectedTaskIds
          : [active.id as string];

      reorderTasks(tasksToReorder, over.id as string);
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
          {/* {activeId && activeType === "task" && (
            <TaskItem
              task={taskStore.tasks.get(activeId as string)!}
              isSelected={false}
              isDragging
            />
          )} */}
          {activeId && activeType === "multiple-tasks" && (
            <MultipleTasksOverlay count={selectedTaskIds.length} />
          )}
        </DragOverlay>
      </DndKitContext>
    </DndContext.Provider>
  );
});

export function useDndContext() {
  const context = useContext(DndContext);
  if (!context) {
    throw new Error("useDndContext must be used within a DndProvider");
  }
  return context;
}
