import * as React from 'react'

import { cn } from '@/lib/utils'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  strokeWidth?: number
  hideText?: boolean
}

export const CircularProgress = React.forwardRef<HTMLDivElement, Props>(
  ({ value, strokeWidth = 4, className, hideText, ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), 100)
    const radius = 16
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <svg
          className="size-full -rotate-90"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            className="stroke-current text-primary/30"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            className="stroke-current text-primary"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: `stroke-dashoffset 300ms ease-in-out`,
            }}
          />
        </svg>

        {/* Percentage Text */}
        {!hideText && (
          <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">
            <span className="text-center font-bold leading-none text-primary dark:text-foreground">
              {percentage}%
            </span>
          </div>
        )}
      </div>
    )
  },
)

CircularProgress.displayName = 'CircularProgress'
