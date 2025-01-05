import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { ChecklistItemRow, TaskRow } from "@/schema";
import { ChecklistItem } from "./checklist-item";
import { useZero } from "@/hooks/use-zero";
import { v4 } from "uuid";

type Props = {
  task: TaskRow & { checklistItems: readonly ChecklistItemRow[] };
};

export const ChecklistList = ({ task }: Props) => {
  const zero = useZero();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      const oldIndex = (task?.checklistItems || []).findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = (task?.checklistItems || []).findIndex(
        (item) => item.id === over.id,
      );

      const newChecklist = arrayMove(
        task?.checklistItems || [],
        oldIndex,
        newIndex,
      ).map((item, index) => ({ ...item, sort_order: index }));

      newChecklist.forEach((item) => {
        zero.mutate.checklist_item.update({
          id: item.id,
          sort_order: item.sort_order,
        });
      });
    },
    [task.id, task.checklistItems, zero.mutate.task],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleUpdateItem = useCallback(
    (updatedItem: ChecklistItemRow) => {
      zero.mutate.checklist_item.update({
        ...updatedItem,
        id: updatedItem.id,
      });
    },
    [zero.mutate.checklist_item],
  );

  const handleAddItem = useCallback(() => {
    zero.mutate.checklist_item.insert({
      id: v4(),
      task_id: task.id,
      title: "",
      completed_at: null,
      sort_order: (task?.checklistItems || []).length,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    });
  }, [task.id, zero.mutate.checklist_item]);

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={task?.checklistItems || []}
          strategy={verticalListSortingStrategy}
        >
          {(task?.checklistItems || []).map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              isDragging={activeId === item.id}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddItem}
        className="w-full justify-start text-muted-foreground hover:text-foreground"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};
