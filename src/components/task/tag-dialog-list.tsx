// components/tag-dialog/tag-list.tsx
import { useQuery } from "@rocicorp/zero/react";
import { Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useZero } from "@/hooks/use-zero";
import { TagRow, TaskRow } from "@/schema";

import { DialogTitle } from "../ui/dialog";

type Props = {
  task: TaskRow & { tags: readonly TagRow[] };
  onNewTag: () => void;
  onManageTags: () => void;
  onClose: () => void;
};

export const TagDialogList = ({
  task,
  onNewTag,
  onManageTags,
  onClose,
}: Props) => {
  const [search, setSearch] = useState("");
  const zero = useZero();
  const [availableTags] = useQuery(zero.query.tag);

  const filteredTags = availableTags?.filter((tag) =>
    tag.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggleTag = async (tag: TagRow) => {
    const isSelected = task.tags.some((t) => t.id === tag.id);

    if (isSelected) {
      await zero.mutate.task_tag.delete({
        task_id: task.id,
        tag_id: tag.id,
      });
    } else {
      await zero.mutate.task_tag.insert({
        task_id: task.id,
        tag_id: tag.id,
        created_at: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-[52px]" />
        <DialogTitle>Tags</DialogTitle>
        <Button variant="ghost" onClick={onClose}>
          Done
        </Button>
      </div>

      <Input
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredTags?.map((tag) => (
            <div
              key={tag.id}
              className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent"
              onClick={() => handleToggleTag(tag)}
            >
              <span>{tag.title}</span>
              {task.tags.some((t) => t.id === tag.id) && (
                <Check className="size-4 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between gap-2 border-t pt-4">
        <Button variant="secondary" onClick={onManageTags} className="w-full">
          Manage Tags
        </Button>

        <Button variant="secondary" onClick={onNewTag} className="w-full">
          New Tag
        </Button>
      </div>
    </div>
  );
};
