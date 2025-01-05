// components/WhenDialog.tsx
import { format, isToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TaskRow } from "@/schema";
import { useCallback, useState } from "react";
import { useZero } from "@/hooks/use-zero";

type Props = {
  task: TaskRow;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const getButtonIcon = (task: TaskRow) => {
  if (task.start === "someday") return "📦";
  if (task.start === "not_started") return "";
  if (task.start_bucket === "evening") return "🌙";
  return "★";
};

export const getButtonText = (task: TaskRow) => {
  if (task.start === "someday") return "Someday";
  if (task.start === "not_started") return "Inbox";
  if (task.start_bucket === "evening") return "This Evening";
  if (task.start_date && isToday(new Date(task.start_date))) return "Today";
  if (task.start_date) return format(new Date(task.start_date), "MMM d");
  return "Today";
};

export const WhenDialog = ({ task, setOpen, open }: Props) => {
  const zero = useZero();

  const onUpdate = useCallback(async (data: any) => {
    await zero.mutate.task.update({
      id: task.id,
      ...data,
    });
  }, []);

  const handleSelect = async (date: Date | undefined) => {
    if (!date) return;

    await onUpdate({
      start: "postponed",
      start_date: date ? Math.floor(date.getTime() / 1000) : null,
      start_bucket: "today",
    });

    setOpen(false);
  };

  const handleToday = async () => {
    await onUpdate({
      start: "started",
      start_bucket: "today",
      start_date: Math.floor(Date.now() / 1000),
    });
    setOpen(false);
  };

  const handleEvening = async () => {
    await onUpdate({
      start: "started",
      start_bucket: "evening",
      start_date: Math.floor(Date.now() / 1000),
    });
    setOpen(false);
  };

  const handleSomeday = async () => {
    await onUpdate({
      start: "someday",
      start_bucket: "someday",
      start_date: null,
    });
    setOpen(false);
  };

  const handleClear = async () => {
    await onUpdate({
      start: "not_started",
      start_bucket: "inbox",
      start_date: null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-none max-w-[320px]">
        <div className="bg-gray-900 text-white rounded-lg p-4">
          <div className="text-gray-400 mb-2">When</div>

          <div className="space-y-1 mb-4">
            <Button
              variant="ghost"
              onClick={handleToday}
              className={cn(
                "w-full justify-start",
                task.start_bucket === "today" && task.start === "started"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-gray-300 hover:text-white",
                "hover:bg-gray-800",
              )}
            >
              <span className="mr-2">★</span>
              Today
              {task.start_bucket === "today" && task.start === "started" && (
                <span className="ml-auto">✓</span>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleEvening}
              className={cn(
                "w-full justify-start",
                task.start_bucket === "evening" && task.start === "started"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-gray-300 hover:text-white",
                "hover:bg-gray-800",
              )}
            >
              <span className="mr-2">🌙</span>
              This Evening
              {task.start_bucket === "evening" && task.start === "started" && (
                <span className="ml-auto">✓</span>
              )}
            </Button>
          </div>

          <DayPicker
            selected={task.start_date ? new Date(task.start_date) : undefined}
            onSelect={handleSelect}
            showOutsideDays={false}
            className="custom-calendar"
            classNames={{
              months: "flex flex-col",
              month: "space-y-2",
              caption: "flex justify-center relative items-center h-8",
              caption_label: "text-sm font-medium text-gray-300",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-300",
              ),
              table: "w-full border-collapse space-y-1",
              head_row: "flex justify-between",
              head_cell: "text-gray-500 w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2 justify-between",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative",
                "first:[&:not([disabled])]:rounded-l-md last:[&:not([disabled])]:rounded-r-md",
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal",
                "hover:bg-gray-800 focus:bg-gray-800 focus:outline-none",
                "text-gray-300 hover:text-white",
              ),
              day_today: "bg-gray-800 text-white",
              day_selected: "bg-blue-500 text-white hover:bg-blue-600",
              day_outside: "text-gray-600",
              day_disabled: "text-gray-600",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
          />

          <Button
            variant="ghost"
            onClick={handleSomeday}
            className={cn(
              "w-full justify-start mt-2",
              task.start === "someday"
                ? "text-blue-400 hover:text-blue-300"
                : "text-gray-300 hover:text-white",
              "hover:bg-gray-800",
            )}
          >
            <span className="mr-2">📦</span>
            Someday
            {task.start === "someday" && <span className="ml-auto">✓</span>}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-gray-300 hover:bg-gray-800 mt-1"
          >
            <span className="mr-2">+</span>
            Add Reminder
          </Button>

          <Button
            variant="secondary"
            onClick={handleClear}
            className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-gray-300"
          >
            Clear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
