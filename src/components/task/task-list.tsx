import { TaskRow } from "@/schema";
import { TaskItem } from "./task-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDndContext } from "../dnd/dnd-context";
import { useContext } from "react";
import { RootStoreContext } from "@/lib/stores/root-store";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";

type Props = {
  tasks: readonly TaskRow[];
  className?: string;
};

export const TaskList = observer(({ tasks, className }: Props) => {
  const {
    localStore: { selectedTaskIds },
  } = useContext(RootStoreContext);

  const { isDragging, activeType } = useDndContext();

  return (
    <SortableContext
      items={tasks.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        className={cn(
          "flex flex-col gap-1",
          isDragging && "cursor-grabbing",
          className,
        )}
      >
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selectedTaskIds.includes(task.id)}
          />
        ))}
      </div>
    </SortableContext>
  );
});
