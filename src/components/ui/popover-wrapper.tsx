import { ReactNode } from 'react'

import { PopoverContent } from '@/components/ui/popover'

type PopoverWrapperProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export const PopoverWrapper = ({
  title,
  description,
  children,
  className,
}: PopoverWrapperProps) => {
  return (
    <PopoverContent
      className={`w-80 rounded-lg p-4 shadow-lg ${className}`}
      sideOffset={5}
      align="start"
    >
      <div className="space-y-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <div className="grid gap-2">{children}</div>
      </div>
    </PopoverContent>
  )
}
