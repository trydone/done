import { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { NewTaskDialog } from "../task/new-task-dialog";

export const Footer = () => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  return (
    <>
      <footer>
        <Button
          title="New task"
          variant="secondary"
          onClick={() => setTaskDialogOpen(true)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </footer>

      <NewTaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
      />
    </>
  );
};
