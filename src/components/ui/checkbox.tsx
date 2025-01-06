'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'

import {cn} from '@/lib/utils'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  hasError?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({className, ...props}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'ft-checkbox focus-visible:ring-offset-px peer relative size-[14px] shrink-0 overflow-hidden rounded-[3px] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white',
      className,
    )}
    {...props}
  >
    <div className="flex items-center justify-center text-white">
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
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export {Checkbox}
