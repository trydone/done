import { GripVerticalIcon } from "lucide-react";
import { TaskMetadata } from "./task-metadata";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskRow } from "@/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  task: TaskRow;
  checked: boolean;
  onComplete: (checked: boolean) => void;
};

export const TaskItemContent = ({ task, onComplete, checked }: Props) => {
  const formatCompletedDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return format(date, "d MMM"); // Format as "4 Jan"
  };

  return (
    <>
      <Checkbox
        checked={checked}
        onCheckedChange={(checked) => onComplete(checked as boolean)}
        className="shrink-0"
      />

      <div className="flex flex-grow min-w-0">
        <div className="flex items-center gap-2">
          {task.completed_at && (
            <span className="text-sm text-gray-400">
              {formatCompletedDate(task.completed_at)}
            </span>
          )}

          <span
            className={cn("text-sm truncate", {
              "text-muted-foreground": !task?.title,
            })}
          >
            {task?.title || "New To-Do"}
          </span>
        </div>

        <TaskMetadata task={task} />
      </div>
    </>
  );
};
