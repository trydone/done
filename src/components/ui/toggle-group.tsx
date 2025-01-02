'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils/cn'

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        secondary: 'border border-input bg-background text-foreground',
      },
      size: {
        lg: 'h-[60px] rounded-[18px] px-4 text-lg font-semibold tracking-tight md:text-xl',
        default: 'h-[52px] rounded-[16px] px-4 py-2 font-semibold',
        sm: 'h-[36px] rounded-[12px] px-3 text-sm font-medium',
        xs: 'h-[30px] rounded-[8px] px-2 text-xs font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('mb-2', className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants> & { selected?: boolean }
>(({ selected, className, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }), {
      'font-bold': selected,
    })}
    {...props}
  />
))
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem, toggleVariants }
