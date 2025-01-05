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
    <div className="flex gap-2 px-4">
      <div className="pt-4 pb-1">
        <div className="h-[20px] flex items-center">
          <Checkbox
            id={`task-${task.id}-status`}
            checked={checked}
            onCheckedChange={onComplete}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-colors"
          />
        </div>
      </div>

      <Input
        id={`task-${task.id}-title`}
        value={task.title}
        onChange={handleTitleChange}
        placeholder="New To-Do"
        className="border-none focus-visible:ring-0 p-0 pt-4 pb-1 h-auto !rounded-none text-sm bg-transparent placeholder:text-muted-foreground"
        autoFocus
      />
    </div>
  );
};
