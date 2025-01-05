import { XIcon } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { TagRow, TaskRow } from "@/schema";
import { useCallback, useRef, useState } from "react";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { v4 } from "uuid";

type Props = {
  task: TaskRow & { tags: readonly TagRow[] };
  className?: string;
  disabled?: boolean;
};

export const TagList = ({ task, className, disabled = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const comboboxRef = useRef<any>(null);

  const zero = useZero();
  const [availableTags] = useQuery(zero.query.tag);

  const handleAddTag = useCallback(
    async (tag: TagRow) => {
      if (!task.tags.find((t) => t.id === tag.id)) {
        await zero.mutate.task_tag.insert({
          id: v4(),
          task_id: task.id,
          tag_id: tag.id,
        });
        comboboxRef.current?.clearInput();
        setIsOpen(false);
      }
    },
    [task.id, task.tags, zero.mutate.task_tag],
  );

  const handleRemoveTag = useCallback(
    (tagId: string) => {
      zero.mutate.task_tag.delete({
        taskId: task.id,
        tagId: tagId,
      });
    },
    [task.id, zero.mutate.task_tag],
  );

  const handleCreateTag = useCallback(async () => {
    if (inputValue.trim()) {
      const newTag = {
        id: v4(),
        name: inputValue.trim(),
      };

      await zero.mutate.tag.insert(newTag);
      await handleAddTag(newTag);
      setInputValue("");
    }
  }, [inputValue, handleAddTag, zero.mutate.tag]);

  const options =
    availableTags?.map((tag) => ({
      id: tag.id,
      label: tag.name,
    })) || [];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {task.tags.map((tag) => (
          <div
            key={tag.id}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-sm rounded-md",
              "transition-colors",
              disabled && "opacity-50",
            )}
          >
            <span>{tag.name}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {!disabled && (
          <div className="relative">
            <Combobox
              ref={comboboxRef}
              options={options}
              value={undefined}
              onChange={(changes) => {
                if (changes.selectedItem) {
                  const selectedTag = availableTags?.find(
                    (tag) => tag.id === changes.selectedItem.id,
                  );
                  if (selectedTag) {
                    handleAddTag(selectedTag);
                  }
                }
              }}
              onInputChange={(changes) => {
                setInputValue(changes?.inputValue || "");
              }}
              placeholder="Add tag..."
              clearable
              noResults={
                inputValue.trim() ? (
                  <button
                    className="flex items-center w-full p-2 text-sm text-left hover:bg-accent"
                    onClick={handleCreateTag}
                  >
                    Create "{inputValue}"
                  </button>
                ) : (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Type to search or create
                  </div>
                )
              }
            >
              {options.map((option) => {
                const tag = availableTags?.find((t) => t.id === option.id);
                if (!tag) return null;
                return (
                  <div
                    key={option.id}
                    className="flex items-center gap-2 px-2 py-1"
                  >
                    <div className="w-3 h-3 rounded-full" />
                    <span>{tag.name}</span>
                  </div>
                );
              })}
            </Combobox>
          </div>
        )}
      </div>
    </div>
  );
};
