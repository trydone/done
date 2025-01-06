import * as React from 'react'

import { Button, ButtonProps } from '@/components/ui/button'
import { Surface } from '@/components/ui/surface'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Toolbar Wrapper
interface ToolbarWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  shouldShowContent?: boolean
  isVertical?: boolean
}

const ToolbarWrapper = React.forwardRef<HTMLDivElement, ToolbarWrapperProps>(
  (
    {
      shouldShowContent = true,
      children,
      isVertical = false,
      className,
      ...props
    },
    ref,
  ) => {
    if (!shouldShowContent) return null

    return (
      <Surface
        className={cn(
          'inline-flex h-full gap-0.5 leading-none',
          isVertical ? 'flex-col p-2' : 'flex-row items-center p-1',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Surface>
    )
  },
)
ToolbarWrapper.displayName = 'ToolbarWrapper'

// Toolbar Divider
interface ToolbarDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  horizontal?: boolean
}

const ToolbarDivider = React.forwardRef<HTMLDivElement, ToolbarDividerProps>(
  ({ horizontal, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'bg-muted',
          horizontal
            ? 'my-1 h-[1px] w-full min-w-[1.5rem] first:mt-0 last:mt-0'
            : 'mx-1 h-full min-h-[1.5rem] w-[1px] first:ml-0 last:mr-0',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
ToolbarDivider.displayName = 'ToolbarDivider'

// Toolbar Button
interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  activeClassName?: string
  tooltip?: string
  tooltipShortcut?: string[]
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      children,
      size = 'sm',
      variant = 'ghost',
      className,
      tooltip,
      tooltipShortcut,
      activeClassName = 'bg-accent',
      ...props
    },
    ref,
  ) => {
    const button = (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'w-auto min-w-[2rem] gap-1 px-2',
          props.active && activeClassName,
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    )

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
              {tooltip}
              {tooltipShortcut && (
                <span className="ml-2 text-muted-foreground">
                  {tooltipShortcut.join(' + ')}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  },
)
ToolbarButton.displayName = 'ToolbarButton'

export const Toolbar = {
  Wrapper: ToolbarWrapper,
  Divider: ToolbarDivider,
  Button: ToolbarButton,
}

export type { ToolbarWrapperProps, ToolbarDividerProps, ToolbarButtonProps }
