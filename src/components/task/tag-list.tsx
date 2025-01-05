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
};

export const TagList = ({ task }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const comboboxRef = useRef<any>(null);

  const zero = useZero();
  const [availableTags] = useQuery(zero.query.tag);

  const handleAddTag = useCallback(
    async (tag: TagRow) => {
      if (!task.tags.find((t) => t.id === tag.id)) {
        await zero.mutate.task_tag.insert({
          task_id: task.id,
          tag_id: tag.id,
          created_at: Math.floor(Date.now() / 1000),
        });
        comboboxRef.current?.clearInput();
        setIsOpen(false);
      }
    },
    [task.id, task.tags, zero.mutate.task_tag],
  );

  const handleRemoveTag = useCallback(
    (tagId: string) => {
      console.log(tagId, task.id);
      zero.mutate.task_tag.delete({
        task_id: task.id,
        tag_id: tagId,
      });
    },
    [task.id, zero.mutate.task_tag],
  );

  const handleCreateTag = useCallback(async () => {
    if (inputValue.trim()) {
      const newTag = {
        id: v4(),
        title: inputValue.trim(),
        workspace_id: task.workspace_id,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      };

      await zero.mutate.tag.insert(newTag);
      await handleAddTag(newTag);
      setInputValue("");
    }
  }, [inputValue, handleAddTag, zero.mutate.tag]);

  const options =
    availableTags?.map((tag) => ({
      id: tag.id,
      label: tag.title,
    })) || [];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {(task?.tags || []).map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors"
          >
            <span>{tag.title}</span>

            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        ))}

        <div className="relative">
          <Combobox
            ref={comboboxRef}
            options={options}
            value={undefined}
            onChange={(changes) => {
              console.log({ changes });
              if (changes.selectedItem) {
                const selectedTag = (availableTags || []).find(
                  (tag) => tag.id === changes.selectedItem.id,
                );

                console.log({ selectedTag });
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
                  <span>{tag.title}</span>
                </div>
              );
            })}
          </Combobox>
        </div>
      </div>
    </div>
  );
};
