'use client'

import { ChevronRightIcon } from '@fingertip/icons'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={className} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    hideBackground?: boolean
  }
>(({ className, children, hideBackground, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'relative flex flex-1 items-center group/accordion justify-between text-left py-3 font-medium transition-all [&[data-state=open]>div>svg]:rotate-90',
        className,
      )}
      {...props}
    >
      {!hideBackground && (
        <div className="absolute inset-0 -mx-2 my-1 rounded-lg bg-gray-100 transition-colors group-hover/accordion:bg-gray-200 md:-mx-3 dark:bg-muted dark:group-hover/accordion:bg-accent" />
      )}
      <div
        className={cn('relative flex flex-1 items-center justify-between', {
          'underline-offset-2 group-hover/accordion:underline': hideBackground,
        })}
      >
        {children}
        <ChevronRightIcon className="size-4 shrink-0 transition-transform duration-200" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pt-0',
      className,
    )}
    {...props}
  >
    <div className="py-4 text-left">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
