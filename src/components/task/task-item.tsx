import { observer } from "mobx-react-lite";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useContext, useRef, useState } from "react";
import { RootStoreContext } from "@/lib/stores/root-store";
import { TaskItemContent } from "./task-item-content";
import { cn } from "@/lib/utils";
import { TaskRow } from "@/schema";
import { useDndContext } from "../dnd/dnd-context";
import { useZero } from "@/hooks/use-zero";
import { TaskItemDetails } from "./task-item-details";

type Props = {
  task: TaskRow;
  isDragging?: boolean;
  isSelected?: boolean;
};

export const TaskItem = observer(
  ({ task, isDragging: isOverlayDragging, isSelected }: Props) => {
    const zero = useZero();
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [isCheckedLocally, setIsCheckedLocally] = useState(
      !!task.completed_at,
    );

    const {
      localStore: {
        selectedTaskIds,
        setSelectedTaskIds,
        openTaskId,
        setOpenTaskId,
      },
    } = useContext(RootStoreContext);

    const { isDragging: isContextDragging } = useDndContext();

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isSortableDragging,
    } = useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    });

    const isDragging = isOverlayDragging || isSortableDragging;

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();

      if (e.metaKey || e.ctrlKey) {
        const isSelected = selectedTaskIds.includes(task.id);
        const newSelected = isSelected
          ? selectedTaskIds.filter((id) => id !== task.id)
          : [...selectedTaskIds, task.id];
        setSelectedTaskIds(newSelected);
      } else if (e.shiftKey && selectedTaskIds.length > 0) {
        const lastSelectedId = selectedTaskIds[selectedTaskIds.length - 1];
        // You'll need to implement this logic based on your task store structure
        const items = Array.from(tasks.values());
        const lastSelectedIndex = items.findIndex(
          (t) => t.id === lastSelectedId,
        );
        const currentIndex = items.findIndex((t) => t.id === task.id);

        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);

        const rangeIds = items.slice(start, end + 1).map((t) => t.id);
        setSelectedTaskIds(rangeIds);
      } else {
        setSelectedTaskIds([task.id]);
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedTaskIds([]);
      setOpenTaskId(task.id);
    };

    const handleComplete = useCallback(async (checked: boolean) => {
      setIsCheckedLocally(checked);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!checked) {
        await zero.mutate.task.update({
          id: task.id,
          completed_at: null,
        });
        return;
      }

      timeoutRef.current = setTimeout(async () => {
        await zero.mutate.task.update({
          id: task.id,
          completed_at: Math.floor(Date.now() / 1000),
        });
      }, 3000);
    }, []);

    if (openTaskId === task.id) {
      return (
        <TaskItemDetails
          task={task}
          onComplete={handleComplete}
          checked={isCheckedLocally}
        />
      );
    }

    return (
      <div className="mx-2">
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={cn(
            "group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-200",
            {
              "!bg-blue-200": isSelected,
              "shadow-lg": isDragging,
              "opacity-50": isContextDragging && !isSelected,
            },
          )}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <TaskItemContent
            task={task}
            onComplete={handleComplete}
            checked={isCheckedLocally}
          />
        </div>
      </div>
    );
  },
);
