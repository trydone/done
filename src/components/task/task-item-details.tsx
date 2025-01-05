import { ChecklistItemRow, TagRow, TaskRow } from "@/schema";
import { TaskHeader } from "./task-header";
import { TaskNotes } from "./task-notes";
import { ChecklistList } from "./checklist-list";
import { TagList } from "./tag-list";
import { WhenPicker } from "./when-picker";

type Props = {
  task: TaskRow & {
    checklistItems: readonly ChecklistItemRow[];
    tags: readonly TagRow[];
  };
  checked: boolean;
  onComplete: (checked: boolean) => void;
};

export const TaskItemDetails = ({ task, checked, onComplete }: Props) => {
  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-md">
      <TaskHeader task={task} checked={checked} onComplete={onComplete} />
      <div className="flex-1 overflow-y-auto pt-1 p-4">
        <TaskNotes task={task} />
        <ChecklistList task={task} />
        <TagList task={task} />
        <WhenPicker task={task} />
      </div>
    </div>
  );
};
