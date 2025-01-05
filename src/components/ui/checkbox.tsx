"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  hasError?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "ft-checkbox peer size-[14px] shrink-0 relative overflow-hidden rounded-[3px] bg-background hover:bg-muted transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-px disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <div className="flex items-center justify-center text-current">
      <svg
        aria-hidden="true"
        role="presentation"
        viewBox="0 0 17 18"
        className="z-10 h-2 w-3"
      >
        <polyline
          fill="none"
          points="1 9 7 14 15 4"
          stroke="currentColor"
          strokeDasharray={22}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          className="ft-checkbox-polyline"
        />
      </svg>
    </div>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
