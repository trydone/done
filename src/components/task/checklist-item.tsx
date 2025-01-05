import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChecklistItemRow } from "@/schema";
import { useCallback } from "react";
import { useZero } from "@/hooks/use-zero";
import { Button } from "../ui/button";

type Props = {
  item: ChecklistItemRow;
  isDragging: boolean;
};

export const ChecklistItem = ({ item, isDragging }: Props) => {
  const zero = useZero();

  const handleDeleteItem = useCallback(() => {
    zero.mutate.checklist_item.delete({
      id: item.id,
    });
  }, [zero.mutate.checklist_item]);

  const handleCheckedChange = useCallback(
    (checked: any) => {
      zero.mutate.checklist_item.update({
        id: item.id,
        completed_at: checked === true ? Math.floor(Date.now() / 1000) : null,
      });
    },
    [zero.mutate.checklist_item],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      zero.mutate.checklist_item.update({
        id: item.id,
        title: e.target.value,
      });
    },
    [],
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 group rounded-md p-1",
        isDragging && "opacity-50",
      )}
      {...attributes}
    >
      <button
        type="button"
        {...listeners}
        className="cursor-grab disabled:cursor-not-allowed"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <Checkbox
        id={`checklist-item-${item.id}`}
        checked={!!item.completed_at}
        onCheckedChange={handleCheckedChange}
        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      <Input
        value={item.title}
        onChange={handleTitleChange}
        className="border-none focus-visible:ring-0 px-0 py-0 h-auto"
        placeholder="Add item..."
      />

      <Button
        type="button"
        size="sm"
        onClick={handleDeleteItem}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
