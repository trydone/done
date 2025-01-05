import { Button } from "@/components/ui/button";
import { FlagIcon, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { ChecklistItemRow, TaskRow } from "@/schema";
import { useZero } from "@/hooks/use-zero";
import { v4 } from "uuid";

type Props = {
  task: TaskRow & { checklistItems: readonly ChecklistItemRow[] };
};

export const ChecklistButton = ({ task }: Props) => {
  const zero = useZero();

  const handleAddItem = useCallback(() => {
    zero.mutate.checklist_item.insert({
      id: v4(),
      task_id: task.id,
      title: "",
      completed_at: null,
      sort_order: 0,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    });
  }, [task.id, zero.mutate.checklist_item]);

  return (
    <Button variant="ghost" size="sm" onClick={handleAddItem}>
      <FlagIcon className="size-4" />
    </Button>
  );
};
