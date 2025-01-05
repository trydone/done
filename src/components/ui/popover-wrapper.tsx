import { ReactNode } from "react";
import { PopoverContent } from "@/components/ui/popover";

type PopoverWrapperProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export const PopoverWrapper = ({
  title,
  description,
  children,
  className,
}: PopoverWrapperProps) => {
  return (
    <PopoverContent
      className={`w-80 p-4 shadow-lg rounded-lg ${className}`}
      sideOffset={5}
      align="start"
    >
      <div className="space-y-4">
        <h3 className="font-medium text-sm">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        <div className="grid gap-2">{children}</div>
      </div>
    </PopoverContent>
  );
};
