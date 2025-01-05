import { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  PlusIcon,
  CalendarIcon,
  MoveIcon,
  SearchIcon,
  TrashIcon,
  MoreHorizontalIcon,
  ArrowRightIcon,
} from "lucide-react";
import { NewTaskDialog } from "../task/new-task-dialog";
import { useZero } from "@/hooks/use-zero";
import { RootStoreContext } from "@/lib/stores/root-store";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FooterButton } from "./footer-button";
import { PopoverWrapper } from "../ui/popover-wrapper";
import { v4 } from "uuid";

export const Footer = observer(() => {
  const zero = useZero();
  const {
    localStore: {
      openTaskId,
      setOpenTaskId,
      setSelectedTaskIds,
      setQuickSearchQuery,
      buttonStates,
      selectedWorkspaceId,
    },
  } = useContext(RootStoreContext);

  const handleDelete = useCallback(async () => {
    if (!openTaskId) {
      return;
    }

    await zero.mutate.task.update({
      id: openTaskId,
      archived_at: Math.floor(Date.now() / 1000),
    });

    setOpenTaskId(null);
  }, []);

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
  }, []);

  const handleQuickFind = () => {
    setQuickSearchQuery("");
  };

  return (
    <>
      <footer className="flex items-center justify-between gap-1 p-2 w-full border-t bg-white">
        <FooterButton
          icon={PlusIcon}
          title="New To-Do"
          onClick={handleNewTask}
          state={buttonStates.newTask}
        />

        {buttonStates.when !== "hidden" && (
          <Popover>
            <PopoverTrigger asChild>
              <FooterButton
                icon={CalendarIcon}
                title="When"
                state={buttonStates.when}
              />
            </PopoverTrigger>

            <PopoverWrapper
              title="When"
              description="Decide when to start. Today or later?"
            >
              <Button variant="ghost" className="justify-start">
                Today
              </Button>
              <Button variant="ghost" className="justify-start">
                This Evening
              </Button>
              <Button variant="ghost" className="justify-start">
                Tomorrow
              </Button>
              <Button variant="ghost" className="justify-start">
                This Weekend
              </Button>
              <Button variant="ghost" className="justify-start">
                Next Week
              </Button>
              <Button variant="ghost" className="justify-start">
                Someday
              </Button>
            </PopoverWrapper>
          </Popover>
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
                Today
              </Button>
              <Button variant="ghost" className="justify-start">
                This Evening
              </Button>
              <Button variant="ghost" className="justify-start">
                Upcoming
              </Button>
              <Button variant="ghost" className="justify-start">
                Anytime
              </Button>
              <Button variant="ghost" className="justify-start">
                Someday
              </Button>
              <Button variant="ghost" className="justify-start">
                Logbook
              </Button>
              <Button variant="ghost" className="justify-start">
                Trash
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

            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#2D2D2D] text-white rounded-lg p-1"
            >
              <DropdownMenuItem className="text-sm px-3 py-1.5 focus:bg-[#454545] rounded-md cursor-pointer">
                Repeat...
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm px-3 py-1.5 focus:bg-[#454545] rounded-md cursor-pointer">
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm px-3 py-1.5 focus:bg-[#454545] rounded-md cursor-pointer">
                Convert to Project...
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm px-3 py-1.5 focus:bg-[#454545] rounded-md cursor-pointer">
                Share...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </footer>
    </>
  );
});
