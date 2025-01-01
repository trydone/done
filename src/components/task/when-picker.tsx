// components/DatePicker/WhenPicker.tsx
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface WhenPickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export const WhenPicker = ({
  selected,
  onSelect,
  className,
}: WhenPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 px-2 py-1 h-auto text-sm",
            "bg-gray-100 hover:bg-gray-200",
            className,
          )}
        >
          <span className="text-amber-400">★</span>
          Today
          <span className="text-gray-400">×</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="bg-gray-900 text-white rounded-lg p-4 min-w-[280px]">
          <div className="text-gray-400 mb-2">When</div>

          {/* Quick Options */}
          <div className="space-y-1 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-800"
            >
              <span className="mr-2">★</span>
              Today
              {selected &&
                format(selected, "M/d") === format(new Date(), "M/d") && (
                  <span className="ml-auto">✓</span>
                )}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <span className="mr-2">🌙</span>
              This Evening
            </Button>
          </div>

          {/* Calendar */}
          <DayPicker
            selected={selected}
            onSelect={onSelect}
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

          {/* Someday Option */}
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 mt-2"
          >
            <span className="mr-2">📦</span>
            Someday
          </Button>

          {/* Add Reminder */}
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-gray-300 hover:bg-gray-800 mt-1"
          >
            <span className="mr-2">+</span>
            Add Reminder
          </Button>

          {/* Clear Button */}
          <Button
            variant="secondary"
            className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-gray-300"
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Add these styles to your global CSS
const globalStyles = `
.custom-calendar .rdp-months {
  background: transparent;
}

.custom-calendar .rdp-day_selected:not([disabled]) {
  font-weight: normal;
  color: white;
  background-color: rgb(59, 130, 246);
}

.custom-calendar .rdp-day_today:not(.rdp-day_selected) {
  font-weight: normal;
  color: white;
  background-color: rgb(31, 41, 55);
}
`;
