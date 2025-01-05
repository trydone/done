import { differenceInDays, format } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  ListIcon,
  FileTextIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskRow, TagRow, ChecklistItemRow } from "@/schema";

type Props = {
  task: TaskRow & {
    tags: readonly TagRow[];
    checklistItems: readonly ChecklistItemRow[];
  };
  className?: string;
};

export const TaskMetadata = ({ task, className }: Props) => {
  const getDaysLeft = (deadline_at: Date) => {
    const days = differenceInDays(deadline_at, new Date());
    return `${days} days left`;
  };

  const hasLeftMetadata =
    (task?.tags || []).length > 0 ||
    (task?.checklistItems || []).length > 0 ||
    task.reminder_at ||
    task.description;

  if (!hasLeftMetadata && !task.deadline_at) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-1.5 bg-blue-50/50 rounded-lg",
        className,
      )}
    >
      {/* Left side metadata */}
      <div className="flex items-center gap-2">
        {task.reminder_at && (
          <div className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {format(task.reminder_at, "h:mm a")}
            </span>
          </div>
        )}

        {(task?.checklistItems || []).length > 0 && (
          <div className="flex items-center gap-1">
            <ListIcon className="w-3 h-3 text-gray-400" />
          </div>
        )}

        {task.description && (
          <div className="flex items-center gap-1">
            <FileTextIcon className="w-3 h-3 text-gray-400" />
          </div>
        )}

        {(task?.tags || []).map((tag, index) => (
          <div className="flex items-center gap-1" key={index}>
            <TagIcon className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{tag.title}</span>
          </div>
        ))}
      </div>

      {/* Right side with deadline */}
      {task.deadline_at && (
        <div className="flex items-center">
          <span className="text-xs text-gray-500 font-medium">
            {getDaysLeft(new Date(task.deadline_at))}
          </span>
        </div>
      )}
    </div>
  );
};
