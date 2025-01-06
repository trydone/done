import {MutableRefObject} from 'react'

import {useBreakpoint} from '@/hooks/use-breakpoint'
import {cn} from '@/lib/utils'

import {DialogContent} from './dialog'
import {SheetContent} from './sheet'

type Props = {
  children: React.ReactNode
  ref?: MutableRefObject<any>
  mobileClassName?: string
  desktopClassName?: string
  className?: string
  overlayClassName?: string
}

export const ResponsiveSheetContent = ({
  children,
  ref,
  mobileClassName,
  desktopClassName,
  overlayClassName,
  className,
}: Props) => {
  const breakpoint = useBreakpoint()
  const isDesktop = ['lg', 'xl'].includes(breakpoint)

  if (!isDesktop) {
    return (
      <SheetContent
        side="bottom"
        ref={ref}
        className={cn(className, 'rounded-t-[32px]', mobileClassName)}
        overlayClassName={overlayClassName}
      >
        {children}
      </SheetContent>
    )
  }

  return (
    <DialogContent
      className={cn(className, desktopClassName)}
      ref={ref}
      overlayClassName={overlayClassName}
    >
      {children}
    </DialogContent>
  )
}
