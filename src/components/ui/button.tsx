import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center whitespace-nowrap font-sans text-base font-normal transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-orange-600 bg-primary text-white hover:bg-orange-600 active:bg-orange-700 dark:hover:bg-orange-400 dark:active:bg-orange-300",
        secondary:
          "border border-gray-300 bg-background text-foreground hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-600",
        outline:
          "border border-foreground text-foreground hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700",
        muted:
          "border border-gray-150 bg-gray-150 text-foreground hover:border-gray-200 hover:bg-gray-200 active:border-gray-300 active:bg-gray-300 dark:border-gray-750 dark:bg-gray-750 dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:active:border-gray-600 dark:active:bg-gray-600",
        ghost:
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700",
        input:
          "border-[1.5px] border-input bg-card text-base !font-normal text-foreground ring-offset-background focus:border-ring focus:outline-none",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
        destructive:
          "border-red-600 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 dark:active:bg-red-300",
        destructiveSecondary:
          "border border-red-300 bg-background text-red-600 hover:bg-red-100 active:bg-red-200 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900 dark:active:bg-red-800",
        success:
          "border-green-600 bg-green-500 text-white hover:bg-green-600 active:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 dark:active:bg-green-300",
        successSecondary:
          "border border-green-300 bg-background text-green-600 hover:bg-green-100 active:bg-green-200 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900 dark:active:bg-green-800",
        warning:
          "border-yellow-600 bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:active:bg-yellow-300",
        warningSecondary:
          "border border-yellow-300 bg-background text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200 dark:border-yellow-600 dark:text-yellow-300 dark:hover:bg-yellow-900 dark:active:bg-yellow-800",
        info: "border-blue-600 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-300",
        infoSecondary:
          "border border-blue-300 bg-background text-blue-600 hover:bg-blue-100 active:bg-blue-200 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900 dark:active:bg-blue-800",
      },
      size: {
        lg: "h-[60px] rounded-[18px] px-4 text-lg font-semibold tracking-tight md:text-xl",
        default: "h-[52px] rounded-[16px] px-4 py-2 font-semibold",
        sm: "h-[36px] rounded-[12px] px-3 text-sm font-medium",
        xs: "h-[30px] rounded-[8px] px-2 text-xs font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), {
          "cursor-wait": loading,
        })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            data-testid="button-is-loading-children"
            className="invisible opacity-0"
          >
            {children}
          </span>
        ) : (
          children
        )}

        {loading && (
          <span
            className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
            data-testid="button-is-loading"
          >
            <Spinner size={20} strokeWidth={4} />
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

const ButtonDiv = ({
  className,
  variant,
  size,
  loading,
  children,
  style,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <div
      className={cn("truncate", buttonVariants({ variant, size, className }), {
        "cursor-wait": loading,
        "pointer-events-none opacity-50": disabled,
      })}
      style={style}
      onClick={onClick as any}
    >
      {loading ? (
        <span
          data-testid="button-is-loading-children"
          className="invisible opacity-0"
        >
          {children}
        </span>
      ) : (
        children
      )}

      {loading && (
        <span
          className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
          data-testid="button-is-loading"
        >
          <Spinner size={20} strokeWidth={4} />
        </span>
      )}
    </div>
  );
};

export { Button, buttonVariants, ButtonDiv };
