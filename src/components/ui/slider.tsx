'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showValue?: boolean
    showOrigin?: boolean
  }
>(({ className, showOrigin, showValue, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full h-[52px] touch-none select-none items-center cursor-grab',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[12px] w-full grow overflow-hidden rounded-full bg-muted">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
      {showOrigin && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[12px] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-foreground/30" />
      )}
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-[28px] rounded-full border-0.5 border-border bg-white shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      {showValue && (
        <div className="absolute left-1/2 top-[36px] h-[32px] w-fit -translate-x-1/2 text-center text-xs text-foreground">
          {props.value}
        </div>
      )}
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
