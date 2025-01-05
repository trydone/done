import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { TaskRow } from "@/schema";
import { ChangeEvent, useCallback } from "react";
import { useZero } from "@/hooks/use-zero";

type Props = {
  task: TaskRow;
  className?: string;
  disabled?: boolean;
};

export const TaskNotes = ({ task, className, disabled = false }: Props) => {
  const zero = useZero();

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      zero.mutate.task.update({
        id: task.id,
        description: e.target.value,
      });
    },
    [task.id, zero.mutate.task],
  );

  return (
    <div className={cn("space-y-4", className)}>
      <TextareaAutosize
        value={task.description || ""}
        onChange={handleDescriptionChange}
        disabled={disabled}
        placeholder="Add description..."
        minRows={1}
        className={cn(
          "w-full resize-none",
          "text-base leading-relaxed",
          "bg-transparent",
          "border-none outline-none focus:outline-none focus:ring-0",
          "placeholder:text-muted-foreground",
          disabled && "cursor-not-allowed opacity-50",
        )}
        spellCheck="false"
      />
    </div>
  );
};
