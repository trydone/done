import { ComponentProps } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ButtonState } from "@/lib/stores/local-store";

type FooterButtonProps = {
  icon: LucideIcon;
  title: string;
  state?: ButtonState;
} & Omit<ComponentProps<typeof Button>, "children" | "disabled">;

export const FooterButton = ({
  icon: Icon,
  title,
  state = "visible",
  className = "",
  ...props
}: FooterButtonProps) => {
  if (state === "hidden") {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={state === "disabled"}
            className={cn(
              "h-8 w-full p-0",
              "hover:bg-gray-100 focus:bg-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors rounded-md",
              className,
            )}
            {...props}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                state === "disabled" ? "text-gray-400" : "text-gray-700",
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs px-2 py-1">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
