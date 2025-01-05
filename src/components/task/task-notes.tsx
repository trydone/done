import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { TaskRow } from "@/schema";
import { ChangeEvent, useCallback } from "react";
import { useZero } from "@/hooks/use-zero";

type Props = {
  task: TaskRow;
};

export const TaskNotes = ({ task }: Props) => {
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
    <TextareaAutosize
      value={task.description || ""}
      onChange={handleDescriptionChange}
      placeholder="Notes"
      minRows={1}
      className="w-full resize-none p-0 text-sm leading-relaxed bg-transparent border-none outline-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
      spellCheck="false"
    />
  );
};
