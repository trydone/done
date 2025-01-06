import { format, isSameDay, isToday } from "date-fns";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Moon,
  Package,
  Plus,
  Star,
  StarIcon,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useCallback, useContext } from "react";
import { DayPicker, DayProps } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useZero } from "@/hooks/use-zero";
import { RootStoreContext } from "@/lib/stores/root-store";
import { cn } from "@/lib/utils";
import { TaskRow } from "@/schema";

type BaseDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type SingleTaskProps = BaseDialogProps & {
  type: "single";
  task: TaskRow;
};

type MultipleTaskProps = BaseDialogProps & {
  type: "multiple";
  taskIds: string[];
};

type Props = SingleTaskProps | MultipleTaskProps;

type TaskUpdate = {
  start: "not_started" | "started" | "postponed";
  start_bucket: "today" | "evening";
  start_date: number | null;
};

export const getButtonIcon = (task: TaskRow) => {
  if (task.start === "someday") return <Package className="size-4" />;
  if (task.start === "not_started") return <Inbox className="size-4" />;
  if (task.start_bucket === "evening") return <Moon className="size-4" />;
  return <Star className="size-4" />;
};

export const getButtonText = (task: TaskRow) => {
  if (task.start === "someday") return "Someday";
  if (task.start === "not_started") return "Inbox";
  if (task.start_bucket === "evening") return "This Evening";
  if (task.start_date && isToday(new Date(task.start_date))) return "Today";
  if (task.start_date) return format(new Date(task.start_date), "MMM d");
  return "Today";
};

const CustomDaycell = (
  props: DayProps & { selected?: Date; onClick?: (date: Date) => void },
) => {
  const { date, selected, onClick, ...rest } = props;

  const isSelectedDate = selected && isSameDay(date, selected);

  return (
    <button
      {...rest}
      onClick={() => onClick?.(date)}
      className={cn(
        "h-9 w-9 p-0 flex items-center justify-center font-normal",
        "hover:bg-muted focus:bg-muted focus:outline-none",
        "text-foreground/60 hover:text-foreground",
        {
          "bg-muted text-foreground": isSelectedDate,
        },
      )}
    >
      {isToday(date) ? <StarIcon className="size-4" /> : format(date, "d")}
    </button>
  );
};

export const WhenDialog = observer((props: Props) => {
  const zero = useZero();

  const {
    localStore: { setOpenTaskId, setSelectedTaskIds },
  } = useContext(RootStoreContext);

  const updateTasks = useCallback(
    async (update: TaskUpdate) => {
      const ids = props.type === "single" ? [props.task.id] : props.taskIds;
      await Promise.all(
        ids.map((id) =>
          zero.mutate.task.update({
            id,
            ...update,
          }),
        ),
      );

      setOpenTaskId(null);
      setSelectedTaskIds([]);
    },
    [props, setOpenTaskId, setSelectedTaskIds, zero.mutate.task],
  );

  const handleSelect = async (date: Date | undefined) => {
    if (!date) return;

    await updateTasks({
      start: isToday(date) ? "started" : "postponed",
      start_date: date ? date.getTime() : null,
      start_bucket: "today",
    });

    props.setOpen(false);
  };

  const handleToday = async () => {
    await updateTasks({
      start: "started",
      start_bucket: "today",
      start_date: Date.now(),
    });
    props.setOpen(false);
  };

  const handleEvening = async () => {
    await updateTasks({
      start: "started",
      start_bucket: "evening",
      start_date: Date.now(),
    });
    props.setOpen(false);
  };

  const handleSomeday = async () => {
    await updateTasks({
      start: "postponed",
      start_bucket: "today",
      start_date: null,
    });
    props.setOpen(false);
  };

  const handleClear = async () => {
    await updateTasks({
      start: "not_started",
      start_bucket: "today",
      start_date: null,
    });
    props.setOpen(false);
  };

  const singleTask = props.type === "single" ? props.task : null;

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="max-w-[320px] border-none p-0">
        <div className="rounded-lg p-4">
          <DialogTitle>When</DialogTitle>

          <div className="mb-4 space-y-1">
            <Button
              variant="ghost"
              onClick={handleToday}
              className={cn(
                "w-full justify-start",
                singleTask?.start_bucket === "today" &&
                  singleTask?.start === "started"
                  ? "text-primary hover:text-primary/90"
                  : "text-foreground/60 hover:text-foreground",
                "hover:bg-muted",
              )}
            >
              <Star className="mr-2 size-4" />
              Today
              {singleTask?.start_bucket === "today" &&
                singleTask?.start === "started" && (
                  <Check className="ml-auto size-4" />
                )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleEvening}
              className={cn(
                "w-full justify-start",
                singleTask?.start_bucket === "evening" &&
                  singleTask?.start === "started"
                  ? "text-primary hover:text-primary/90"
                  : "text-foreground/60 hover:text-foreground",
                "hover:bg-muted",
              )}
            >
              <Moon className="mr-2 size-4" />
              This Evening
              {singleTask?.start_bucket === "evening" &&
                singleTask?.start === "started" && (
                  <Check className="ml-auto size-4" />
                )}
            </Button>
          </div>

          <DayPicker
            selected={
              singleTask?.start_date
                ? new Date(singleTask.start_date)
                : undefined
            }
            onSelect={handleSelect}
            showOutsideDays={false}
            fromDate={new Date()}
            defaultMonth={new Date()}
            mode="single"
            className="custom-calendar"
            classNames={{
              months: "flex flex-col",
              month: "space-y-2",
              caption: "flex justify-center relative items-center h-8",
              caption_label: "text-sm font-medium text-foreground",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground",
              ),
              table: "w-full border-collapse space-y-1",
              head_row: "flex justify-between",
              head_cell: "text-muted-foreground w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2 justify-between",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative",
                "first:[&:not([disabled])]:rounded-l-md last:[&:not([disabled])]:rounded-r-md",
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal",
                "hover:bg-muted focus:bg-muted focus:outline-none",
                "text-foreground/60 hover:text-foreground",
              ),
              day_today: "bg-muted text-foreground",
              day_selected: "bg-muted text-foreground",
              day_outside: "text-muted-foreground/50",
              day_disabled: "text-muted-foreground/50",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: () => <ChevronLeft className="size-4" />,
              IconRight: () => <ChevronRight className="size-4" />,
              Day: (props: DayProps) => (
                <CustomDaycell
                  {...props}
                  selected={
                    singleTask?.start_date
                      ? new Date(singleTask.start_date)
                      : undefined
                  }
                  onClick={handleSelect}
                />
              ),
            }}
          />

          <Button
            variant="ghost"
            onClick={handleSomeday}
            className={cn(
              "mt-2 w-full justify-start",
              singleTask?.start === "someday"
                ? "text-primary hover:text-primary/90"
                : "text-foreground/60 hover:text-foreground",
              "hover:bg-muted",
            )}
          >
            <Package className="mr-2 size-4" />
            Someday
            {singleTask?.start === "someday" && (
              <Check className="ml-auto size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            className="mt-1 w-full justify-start text-foreground/60 hover:bg-muted hover:text-foreground"
          >
            <Plus className="mr-2 size-4" />
            Add Reminder
          </Button>

          <Button
            variant="secondary"
            onClick={handleClear}
            className="mt-4 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Clear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
