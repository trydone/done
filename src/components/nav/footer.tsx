import { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { TaskComposer } from "./task-composer";

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

      <TaskComposer
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
      />
    </>
  );
};
