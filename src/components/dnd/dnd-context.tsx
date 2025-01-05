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
import { MultipleTasksOverlay } from "../task/multiple-task-overlay";
import { useZero } from "@/hooks/use-zero";
import { TaskRow } from "@/schema";
import { useQuery } from "@rocicorp/zero/react";
import _ from "lodash";

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

const REORDER_STEP = 1000;

export const DndProvider = observer(({ children }: { children: ReactNode }) => {
  const {
    localStore: { selectedTaskIds },
  } = useContext(RootStoreContext);

  const zero = useZero();

  const [{ activeId, activeType }, setDragState] = useState<DragState>({
    activeId: null,
    activeType: null,
  });

  // Active task for drag overlay
  const [activeTask] = useQuery(
    zero.query.task.where("id", "=", activeId as string).one(),
    !!activeId,
  );

  // Keep track of all tasks and their order
  const [allTasks] = useQuery(zero.query.task.orderBy("sort_order", "asc"));

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

  const updateTask = async (task: Partial<TaskRow>) => {
    await zero.mutate.task.update({
      id: task.id,
      title: task.title,
      sort_order: task.sort_order,
      start_bucket: task.start_bucket,
    });
  };

  const updateTasksBucket = async (taskIds: string[], newBucket: string) => {
    const tasksByBucket = _.groupBy(allTasks, "start");
    const tasksInTargetBucket = tasksByBucket[newBucket] || [];
    const firstSortOrder =
      tasksInTargetBucket.length > 0
        ? tasksInTargetBucket[0].sort_order - REORDER_STEP
        : 0;

    for (let i = 0; i < taskIds.length; i++) {
      await updateTask({
        id: taskIds[i],
        start_bucket: newBucket,
        sort_order: firstSortOrder - i * REORDER_STEP,
      });
    }
  };

  const reorderTasks = async (taskIds: string[], targetId: string) => {
    const targetTask = allTasks.find((t) => t.id === targetId);
    if (!targetTask) return;

    const tasksByBucket = _.groupBy(allTasks, "start");

    const tasksInBucket = tasksByBucket[targetTask.start_bucket] || [];
    const targetIndex = tasksInBucket.findIndex((t) => t.id === targetId);
    const prevTask = targetIndex > 0 ? tasksInBucket[targetIndex - 1] : null;
    const nextTask =
      targetIndex < tasksInBucket.length - 1
        ? tasksInBucket[targetIndex + 1]
        : null;

    let newSortOrder: number;
    if (!prevTask) {
      newSortOrder = nextTask ? nextTask.sort_order - REORDER_STEP : 0;
    } else if (!nextTask) {
      newSortOrder = prevTask.sort_order + REORDER_STEP;
    } else {
      newSortOrder = (prevTask.sort_order + nextTask.sort_order) / 2;
    }

    for (let i = 0; i < taskIds.length; i++) {
      await updateTask({
        id: taskIds[i],
        sort_order: newSortOrder + i * (REORDER_STEP / 100),
      });
    }
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const isSelected = selectedTaskIds.includes(active.id as string);
    setDragState({
      activeId: active.id,
      activeType:
        isSelected && selectedTaskIds.length > 1 ? "multiple-tasks" : "task",
    });
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) {
      setDragState({ activeId: null, activeType: null });
      return;
    }

    const activeData = active.data.current as { type?: string };
    const overData = over.data.current as { type?: string };

    if (overData?.type === "bucket") {
      const tasksToMove =
        activeType === "multiple-tasks"
          ? selectedTaskIds
          : [active.id as string];
      await updateTasksBucket(tasksToMove, over.id as string);
    } else if (activeData?.type === "task" && overData?.type === "task") {
      const tasksToReorder =
        activeType === "multiple-tasks"
          ? selectedTaskIds
          : [active.id as string];
      await reorderTasks(tasksToReorder, over.id as string);
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
          {activeId && activeType === "task" && activeTask && (
            <TaskItem task={activeTask} isSelected={false} isDragging />
          )}
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
