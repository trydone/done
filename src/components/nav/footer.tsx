import {
  ArrowRightIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useState } from "react";
import { v4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useZero } from "@/hooks/use-zero";
import { RootStoreContext } from "@/lib/stores/root-store";

import { WhenDialog } from "../task/when-dialog";
import { PopoverWrapper } from "../ui/popover-wrapper";
import { FooterButton } from "./footer-button";

export const Footer = observer(() => {
  const zero = useZero();
  const [whenOpen, setWhenOpen] = useState(false);

  const {
    localStore: {
      openTaskId,
      setOpenTaskId,
      setQuickSearchQuery,
      buttonStates,
      selectedWorkspaceId,
      selectedTaskIds,
    },
  } = useContext(RootStoreContext);

  const handleDelete = useCallback(async () => {
    if (!openTaskId) {
      return;
    }

    await zero.mutate.task.update({
      id: openTaskId,
      archived_at: Date.now(),
    });

    setOpenTaskId(null);
  }, [openTaskId, setOpenTaskId, zero.mutate.task]);

  const handleNewTask = useCallback(async () => {
    const taskId = v4();

    await zero.mutate.task.insert({
      id: taskId,
      workspace_id:
        selectedWorkspaceId || `9d190060-d582-4136-827d-cd0468d081ec`,
      title: "",
      description: "",
      created_at: Date.now(),
      creator_id: "9ecb970e-0fee-4dfd-9721-2c04c8ed7607",
      updated_at: Date.now(),
      start: "not_started",
      start_bucket: "inbox",
    });

    setOpenTaskId(taskId);
  }, [selectedWorkspaceId, setOpenTaskId, zero.mutate.task]);

  const handleQuickFind = () => {
    setQuickSearchQuery("");
  };

  return (
    <>
      <footer className="flex w-full items-center justify-between gap-1 border-t bg-background p-2">
        <FooterButton
          icon={PlusIcon}
          title="New To-Do"
          onClick={handleNewTask}
          state={buttonStates.newTask}
        />

        {buttonStates.when !== "hidden" && (
          <FooterButton
            icon={CalendarIcon}
            title="When"
            state={buttonStates.when}
            onClick={() => setWhenOpen(true)}
          />
        )}

        {buttonStates.move !== "hidden" && (
          <Popover>
            <PopoverTrigger asChild>
              <FooterButton
                icon={ArrowRightIcon}
                title="Move"
                state={buttonStates.move}
              />
            </PopoverTrigger>

            <PopoverWrapper title="Move to">
              <Button variant="ghost" className="justify-start">
                Inbox
              </Button>
            </PopoverWrapper>
          </Popover>
        )}

        <FooterButton
          icon={SearchIcon}
          title="Quick Find"
          onClick={handleQuickFind}
          state={buttonStates.quickSearch}
        />

        <FooterButton
          icon={TrashIcon}
          title="Delete"
          onClick={handleDelete}
          state={buttonStates.delete}
        />

        {buttonStates.moreActions !== "hidden" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FooterButton
                title="More Actions"
                icon={MoreHorizontalIcon}
                state={buttonStates.moreActions}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 rounded-lg p-1">
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Repeat...
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Convert to Project...
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Share...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </footer>

      {whenOpen && (
        <WhenDialog
          type="multiple"
          taskIds={selectedTaskIds}
          open={whenOpen}
          setOpen={setWhenOpen}
        />
      )}
    </>
  );
});
