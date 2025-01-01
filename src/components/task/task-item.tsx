import { observer } from "mobx-react-lite";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  ListIcon,
  GripVerticalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useContext } from "react";
import { RootStoreContext } from "@/lib/stores/root-store";
import { TaskRow } from "@/schema";

type Props = {
  item: TaskRow;
};

export const TaskItem = observer(({ item }: Props) => {
  const {
    localStore: {
      selectedTaskIds,
      setSelectedTaskIds,
      openTaskId,
      setOpenTaskId,
    },
  } = useContext(RootStoreContext);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (e.metaKey || e.ctrlKey) {
      const newSelected = isSelected
        ? selectedTaskIds.filter((id) => id !== item.id)
        : [...selectedTaskIds, item.id];
      setSelectedTaskIds(newSelected);
    } else if (e.shiftKey && selectedTaskIds.length > 0) {
      const items = Array.from(items.values());
      const lastSelectedId = selectedTaskIds[selectedTaskIds.length - 1];
      const lastSelectedIndex = items.findIndex((t) => t.id === lastSelectedId);
      const currentIndex = items.findIndex((t) => t.id === item.id);

      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);

      const rangeIds = items.slice(start, end + 1).map((t) => t.id);
      setSelectedTaskIds(rangeIds);
    } else {
      setSelectedTaskIds([item.id]);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTaskId(item.id);
    setSelectedTaskIds([]);
  };

  const handleCheckboxChange = (checked: boolean) => {
    updateTask(item.id, { completed: checked });
  };

  const completedChecklist = item.checklist.filter(
    (item) => item.completed,
  ).length;
  const totalChecklist = item.checklist.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group relative flex items-center gap-3 p-3 rounded-lg border",
        "transition-all duration-200 ease-in-out",
        "hover:bg-gray-50",
        isSelected && "bg-blue-50 border-blue-200",
        isDragging && "shadow-lg",
        item.completed && "opacity-50",
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        {...listeners}
        className="cursor-grab opacity-0 group-hover:opacity-100"
      >
        <GripVerticalIcon className="w-4 h-4 text-gray-400" />
      </div>

      <Checkbox
        checked={item.completed}
        onCheckedChange={handleCheckboxChange}
        className="shrink-0"
      />

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium truncate",
              item.completed && "line-through text-gray-500",
            )}
          >
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {item.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <TagIcon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{item.tags.length}</span>
            </div>
          )}

          {item.checklist.length > 0 && (
            <div className="flex items-center gap-1">
              <ListIcon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {completedChecklist}/{totalChecklist}
              </span>
            </div>
          )}

          {item.reminder && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {format(item.reminder, "h:mm a")}
              </span>
            </div>
          )}

          {item.deadline && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {format(item.deadline, "MMM d")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
