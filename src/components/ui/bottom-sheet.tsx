'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import { cn } from '@/lib/utils'

const BottomSheet = DialogPrimitive.Root

const BottomSheetPortal = DialogPrimitive.Portal

const BottomSheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-[100] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
BottomSheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    overlayClassName?: string
    hideOverlay?: boolean
  }
>(
  (
    { className, children, hideOverlay = true, overlayClassName, ...props },
    ref,
  ) => (
    <BottomSheetPortal>
      {!hideOverlay && <BottomSheetOverlay className={overlayClassName} />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed bottom-0 left-1/2 z-[100] w-full -translate-x-1/2 translate-y-0 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:!slide-out-to-top-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:!slide-in-from-top-0 data-[state=open]:slide-in-from-left-1/2 sm:rounded-2xl md:w-full',
          className,
        )}
        style={{ top: 'unset' }}
        {...props}
      >
        <div className="relative">{children}</div>
      </DialogPrimitive.Content>
    </BottomSheetPortal>
  ),
)
BottomSheetContent.displayName = DialogPrimitive.Content.displayName

const BottomSheetOuter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'absolute inset-x-0 top-[-44px] flex items-center justify-between px-4 pointer-events-none',
      className,
    )}
    {...props}
  />
)
BottomSheetOuter.displayName = 'BottomSheetOuter'

const BottomSheetInner = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'bottom-sheet-inner z-[100] grid max-h-[430px] min-h-[50px] w-full gap-4 overflow-y-auto !rounded-b-none rounded-t-[32px] bg-background p-0 border border-border shadow-lg',
      className,
    )}
    {...props}
  />
)
BottomSheetInner.displayName = 'BottomSheetInner'

export { BottomSheet, BottomSheetContent, BottomSheetInner, BottomSheetOuter }
