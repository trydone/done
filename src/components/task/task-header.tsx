import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useZero } from "@/hooks/use-zero";
import { TaskRow } from "@/schema";
import { useCallback } from "react";

type Props = {
  task: TaskRow;
  checked: boolean;
  onComplete: (checked: boolean) => void;
};

export const TaskHeader = ({ task, checked, onComplete }: Props) => {
  const zero = useZero();

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      zero.mutate.task.update({
        id: task.id,
        title: e.target.value,
      });
    },
    [],
  );

  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Checkbox
        id={`task-${task.id}-status`}
        checked={checked}
        onCheckedChange={onComplete}
        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-colors"
      />

      <Input
        id={`task-${task.id}-title`}
        value={task.title}
        onChange={handleTitleChange}
        placeholder="Task title"
        className="border-none focus-visible:ring-0 text-lg font-medium bg-transparent placeholder:text-muted-foreground"
      />
    </div>
  );
};
