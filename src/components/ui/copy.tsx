"use client";

import { CircleCheckIcon, SquareBehindSquare1Icon } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import copy from "copy-to-clipboard";
import React, {
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type CopyProps = HTMLAttributes<HTMLButtonElement> & {
  content: string;
  asChild?: boolean;
  onCopy?: () => void;
};

/**
 * This component is based on the `button` element and supports all of its props
 */
const Copy = forwardRef<HTMLButtonElement, CopyProps>(
  (
    {
      children,
      className,
      /**
       * The content to copy.
       */
      content,
      /**
       * Whether to remove the wrapper `button` element and use the
       * passed child element instead.
       */
      asChild = false,
      onCopy,
      ...props
    }: CopyProps,
    ref,
  ) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [done, setDone] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("Copy");

    const copyToClipboard = useCallback(() => {
      setDone(true);
      copy(content);
      onCopy?.();

      setTimeout(() => {
        setDone(false);
      }, 2000);
    }, [content, onCopy]);

    useEffect(() => {
      if (done) {
        setText("Copied");
        return;
      }

      setTimeout(() => {
        setText("Copy");
      }, 500);
    }, [done]);

    const Component = asChild ? Slot : "button";

    return (
      <TooltipProvider>
        <Tooltip defaultOpen={false} open={done || open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <Component
              ref={ref}
              aria-label="Copy code snippet"
              type="button"
              className={cn("h-fit w-fit", className)}
              onClick={copyToClipboard}
              onPointerEnter={() => setShowTooltip(true)}
              onPointerLeave={() => setShowTooltip(false)}
              {...props}
            >
              {children ? (
                children
              ) : done ? (
                <CircleCheckIcon />
              ) : (
                <SquareBehindSquare1Icon />
              )}
            </Component>
          </TooltipTrigger>
          {showTooltip && <TooltipContent>{text}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    );
  },
);
Copy.displayName = "Copy";

export { Copy };
