import {
  ArrowCornerDownLeftIcon,
  ArrowDownIcon,
  ArrowLeftXIcon,
  ArrowUpIcon,
  ArrowWall2RightIcon,
  CmdIcon,
  ShiftIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type KbdIcon =
  | "mod"
  | "shift"
  | "enter"
  | "command"
  | "ctrl"
  | "alt"
  | "tab"
  | "backspace"
  | "up"
  | "down";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  icon?: KbdIcon;
}

const iconMap: Record<KbdIcon, React.ReactNode> = {
  mod: <CmdIcon className="size-3" />,
  shift: <ShiftIcon className="size-3" />,
  enter: <ArrowCornerDownLeftIcon className="size-3" />,
  command: <CmdIcon className="size-3" />,
  ctrl: "Ctrl",
  alt: "Alt",
  tab: <ArrowWall2RightIcon className="size-3" />,
  backspace: <ArrowLeftXIcon className="size-3" />,
  up: <ArrowUpIcon className="size-3" />,
  down: <ArrowDownIcon className="size-3" />,
};

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, children, icon, ...props }, ref) => {
    const content = icon ? iconMap[icon] : children;

    return (
      <kbd
        ref={ref}
        className={cn(
          "pointer-events-none size-5 select-none justify-center items-center gap-1 rounded border bg-muted flex font-mono text-[10px] font-medium",
          className,
        )}
        {...props}
      >
        {content}
      </kbd>
    );
  },
);
Kbd.displayName = "Kbd";

export { Kbd };
