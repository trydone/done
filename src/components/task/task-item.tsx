import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { observer } from "mobx-react-lite";
import {
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { useZero } from "@/hooks/use-zero";
import { RootStoreContext } from "@/lib/stores/root-store";
import { cn } from "@/lib/utils";
import { TaskRow } from "@/schema";

import { useDndContext } from "../dnd/dnd-context";
import { TaskItemContent } from "./task-item-content";
import { TaskItemDetails } from "./task-item-details";

type Props = {
  task: TaskRow;
  isDragging?: boolean;
  isSelected?: boolean;
  showWhenIcon?: boolean;
};

export const TaskItem = observer(
  ({
    task,
    isDragging: isOverlayDragging,
    isSelected,
    showWhenIcon,
  }: Props) => {
    const zero = useZero();
    const timeoutRef = useRef<NodeJS.Timeout>(null);
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

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (e.metaKey || e.ctrlKey) {
        const isSelected = selectedTaskIds.includes(task.id);
        const newSelected = isSelected
          ? selectedTaskIds.filter((id) => id !== task.id)
          : [...selectedTaskIds, task.id];
        setSelectedTaskIds(newSelected);
      } else {
        setSelectedTaskIds([task.id]);
      }
    };

    const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setSelectedTaskIds([]);
      setOpenTaskId(task.id);
    };

    const handleComplete = useCallback(
      async (checked: boolean) => {
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
            completed_at: Date.now(),
          });
        }, 3000);
      },
      [task.id, zero.mutate.task],
    );

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
            "group relative flex items-center gap-2 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-muted",
            {
              "bg-blue-200 dark:bg-blue-800": isSelected,
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
            showWhenIcon={showWhenIcon}
          />
        </div>
      </div>
    );
  },
);
