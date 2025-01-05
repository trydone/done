import { TagRow, TaskRow } from "@/schema";
import { Badge } from "../ui/badge";
import { getButtonIcon, getButtonText } from "./when-dialog";
import { Button } from "../ui/button";

type Props = {
  task: TaskRow;
  setOpen: (open: boolean) => void;
};

export const WhenLabel = ({ task, setOpen }: Props) => {
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2 px-2 py-1 h-auto text-sm"
      onClick={() => setOpen(true)}
    >
      {getButtonIcon(task)} {getButtonText(task)}
    </Button>
  );
};
