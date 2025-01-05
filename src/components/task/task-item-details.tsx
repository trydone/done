import { ChecklistItemRow, TagRow, TaskRow } from "@/schema";
import { TaskHeader } from "./task-header";
import { TaskNotes } from "./task-notes";
import { ChecklistList } from "./checklist-list";
import { TagList } from "./tag-list";
import { WhenPicker } from "./when-picker";
import { ChecklistButton } from "./checklist-button";
import { TagButton } from "./tag-button";
import { useState } from "react";
import { TagDialog } from "./tag-dialog";
import { WhenButton } from "./when-button";
import { WhenLabel } from "./when-label";
import { WhenDialog } from "./when-dialog";

type Props = {
  task: TaskRow & {
    checklistItems: readonly ChecklistItemRow[];
    tags: readonly TagRow[];
  };
  checked: boolean;
  onComplete: (checked: boolean) => void;
};

export const TaskItemDetails = ({ task, checked, onComplete }: Props) => {
  const [tagOpen, setTagOpen] = useState(false);
  const [whenOpen, setWhenOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full bg-background rounded-lg shadow-md">
        <TaskHeader task={task} checked={checked} onComplete={onComplete} />
        <TaskNotes task={task} />
        <ChecklistList task={task} />
        <TagList task={task} setOpen={setTagOpen} />

        <div className="flex items-center pt-3 pl-10 pr-3 pb-4">
          <div className="flex-1">
            {task?.start !== "not_started" && (
              <WhenLabel task={task} setOpen={setWhenOpen} />
            )}
          </div>

          {(task?.tags || []).length === 0 && (
            <TagButton task={task} setOpen={setTagOpen} />
          )}

          {(task?.checklistItems || []).length === 0 && (
            <ChecklistButton task={task} />
          )}

          {task?.start === "not_started" && (
            <WhenButton task={task} setOpen={setWhenOpen} />
          )}
        </div>
      </div>

      {tagOpen && <TagDialog task={task} open={tagOpen} setOpen={setTagOpen} />}

      {whenOpen && (
        <WhenDialog task={task} open={whenOpen} setOpen={setWhenOpen} />
      )}
    </>
  );
};
