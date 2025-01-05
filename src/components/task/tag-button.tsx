import { Button } from "@/components/ui/button";
import { PlusIcon, TagIcon } from "lucide-react";
import { TagRow, TaskRow } from "@/schema";

type Props = {
  task: TaskRow & { tags: readonly TagRow[] };
  setOpen: (open: boolean) => void;
};

export const TagButton = ({ task, setOpen }: Props) => {
  return (
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
      <TagIcon className="size-4" />
    </Button>
  );
};
