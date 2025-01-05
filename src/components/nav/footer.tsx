import { useContext, useState } from "react";
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

export const Footer = observer(() => {
  const zero = useZero();
  const {
    localStore: {
      selectedTaskIds,
      setSelectedTaskIds,
      setQuickSearchQuery,
      buttonStates,
    },
  } = useContext(RootStoreContext);

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const handleDelete = async () => {
    for (const taskId of selectedTaskIds) {
      await zero.mutate.task.delete({ id: taskId });
    }
    setSelectedTaskIds([]);
  };

  const handleQuickFind = () => {
    setQuickSearchQuery("");
  };

  return (
    <>
      <footer className="flex items-center justify-between gap-1 p-2 w-full border-t bg-white">
        <FooterButton
          icon={PlusIcon}
          title="New To-Do"
          onClick={() => setTaskDialogOpen(true)}
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

      <NewTaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
      />
    </>
  );
});
