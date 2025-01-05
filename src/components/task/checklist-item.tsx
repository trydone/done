import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChecklistItemRow, TaskRow } from "@/schema";
import { useCallback, KeyboardEvent, useRef } from "react";
import { useZero } from "@/hooks/use-zero";

type Props = {
  task: TaskRow & { checklistItems: readonly ChecklistItemRow[] };
  item: ChecklistItemRow;
  isDragging: boolean;
  onAddItem?: (afterId: string) => void;
  isFocused: boolean;
  onFocusChange: (id: string | null) => void;
  showTopLine: boolean;
  showBottomLine: boolean;
};

export const ChecklistItem = ({
  task,
  item,
  isDragging,
  onAddItem,
  isFocused,
  onFocusChange,
  showTopLine,
  showBottomLine,
}: Props) => {
  const zero = useZero();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => {
    onFocusChange(item.id);
  }, [item.id, onFocusChange]);

  const handleBlur = useCallback(() => {
    onFocusChange(null);
  }, [onFocusChange]);

  const handleDeleteItem = useCallback(() => {
    const items = task?.checklistItems || [];
    const currentIndex = items.findIndex((i) => i.id === item.id);

    // Find the previous item to focus on
    const previousItem = items[currentIndex - 1];

    // Delete the current item
    zero.mutate.checklist_item.delete({
      id: item.id,
    });

    // Update sort orders for remaining items
    const remainingItems = items.filter((i) => i.id !== item.id);
    remainingItems.forEach((item, index) => {
      zero.mutate.checklist_item.update({
        id: item.id,
        sort_order: index,
      });
    });

    // Focus on the previous item's input if it exists
    if (previousItem) {
      const previousInput = document.querySelector(
        `input[data-checklist-id="${previousItem.id}"]`,
      ) as HTMLInputElement;
      if (previousInput) {
        previousInput.focus();
        // Place cursor at the end of the input
        const length = previousInput.value.length;
        previousInput.setSelectionRange(length, length);
      }
    }
  }, [zero.mutate.checklist_item, item.id]);

  const handleCheckedChange = useCallback(
    (checked: any) => {
      zero.mutate.checklist_item.update({
        id: item.id,
        completed_at: checked === true ? Math.floor(Date.now() / 1000) : null,
      });
    },
    [zero.mutate.checklist_item, item.id],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      zero.mutate.checklist_item.update({
        id: item.id,
        title: e.target.value,
      });
    },
    [zero.mutate.checklist_item, item.id],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onAddItem?.(item.id);
      } else if (e.key === "Backspace") {
        const input = e.target as HTMLInputElement;
        if (input.value === "") {
          e.preventDefault();
          handleDeleteItem();
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const items = task?.checklistItems || [];
        const currentIndex = items.findIndex((i) => i.id === item.id);

        let targetIndex;
        if (e.key === "ArrowUp") {
          targetIndex = currentIndex - 1;
        } else {
          targetIndex = currentIndex + 1;
        }

        // Check if target index is valid
        if (targetIndex >= 0 && targetIndex < items.length) {
          const targetItem = items[targetIndex];
          const targetInput = document.querySelector(
            `input[data-checklist-id="${targetItem.id}"]`,
          ) as HTMLInputElement;

          if (targetInput) {
            targetInput.focus();
            // Place cursor at the end of the input
            const length = targetInput.value.length;
            targetInput.setSelectionRange(length, length);
          }
        }
      }
    },
    [onAddItem, item.id, handleDeleteItem, task.checklistItems],
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
        "group relative rounded-md px-1 border-transparent border",
        {
          "opacity-50": isDragging,
          "border-border bg-muted": isFocused,
        },
      )}
      {...attributes}
    >
      {showTopLine && (
        <div className="h-px inset-x-1 bg-border absolute -top-px pointer-events-none" />
      )}

      <div className={cn("flex items-center gap-2 py-1")}>
        <Checkbox
          id={`checklist-item-${item.id}`}
          checked={!!item.completed_at}
          onCheckedChange={handleCheckedChange}
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />

        <Input
          ref={inputRef}
          data-checklist-id={item.id}
          value={item.title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          className="border-none focus-visible:ring-0 px-0 py-0 h-auto bg-transparent text-sm !rounded-none"
          placeholder="Add item..."
          autoFocus
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <button
          type="button"
          {...listeners}
          className="cursor-grab disabled:cursor-not-allowed"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {showBottomLine && (
        <div className="h-px inset-x-1 bg-border absolute -bottom-px pointer-events-none" />
      )}
    </div>
  );
};
