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
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const handleFocusChange = useCallback((id: string | null) => {
    setFocusedId(id);
  }, []);

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

  const handleUpdateSortOrders = useCallback(
    (items: ChecklistItemRow[]) => {
      items.forEach((item, index) => {
        zero.mutate.checklist_item.update({
          id: item.id,
          sort_order: index,
        });
      });
    },
    [zero.mutate.checklist_item],
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

      handleUpdateSortOrders(newChecklist);
    },
    [task.checklistItems, handleUpdateSortOrders],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleAddItem = useCallback(
    (afterId: string) => {
      const items = [...(task?.checklistItems || [])];
      const currentIndex = items.findIndex((item) => item.id === afterId);
      const newSortOrder =
        currentIndex >= 0 ? items[currentIndex].sort_order + 1 : 0;

      // Insert new item
      const newItem = {
        id: v4(),
        task_id: task.id,
        title: "",
        completed_at: null,
        sort_order: newSortOrder,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      };

      // Insert the new item at the correct position
      items.splice(currentIndex + 1, 0, newItem);

      // Update all sort orders
      handleUpdateSortOrders(items);

      // Create the new item
      zero.mutate.checklist_item.insert(newItem);
    },
    [
      task.id,
      task.checklistItems,
      zero.mutate.checklist_item,
      handleUpdateSortOrders,
    ],
  );

  const focusedIndex = (task?.checklistItems || []).findIndex(
    (item) => focusedId === item.id,
  );

  return (
    <div className="pl-9 pr-3">
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
          {(task?.checklistItems || []).map((item, index) => (
            <ChecklistItem
              key={item.id}
              item={item}
              task={task}
              isDragging={activeId === item.id}
              onAddItem={handleAddItem}
              isFocused={focusedId === item.id}
              onFocusChange={handleFocusChange}
              showTopLine={index === 0}
              showBottomLine={
                focusedId !== item.id && focusedIndex - 1 !== index
              }
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
