import { GripVerticalIcon } from "lucide-react";
import { TaskMetadata } from "./task-metadata";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskRow } from "@/schema";
import { format } from "date-fns";

type Props = {
  task: TaskRow;
  checked: boolean;
  listeners: any;
  onComplete: (checked: boolean) => void;
};

export const TaskItemContent = ({
  task,
  listeners,
  onComplete,
  checked,
}: Props) => {
  const formatCompletedDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return format(date, "d MMM"); // Format as "4 Jan"
  };

  return (
    <>
      <div
        {...listeners}
        className="cursor-grab opacity-0 group-hover:opacity-100"
      >
        <GripVerticalIcon className="w-4 h-4 text-gray-400" />
      </div>

      <Checkbox
        checked={checked}
        onCheckedChange={(checked) => onComplete(checked as boolean)}
        className="shrink-0"
      />

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          {task.completed_at && (
            <span className="text-sm text-gray-400">
              {formatCompletedDate(task.completed_at)}
            </span>
          )}

          <span className="text-sm font-medium truncate">{task.title}</span>
        </div>

        <TaskMetadata task={task} />
      </div>
    </>
  );
};
