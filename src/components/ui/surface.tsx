import * as React from 'react'

import {cn} from '@/lib/utils'

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  withShadow?: boolean
  withBorder?: boolean
}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {className, children, withShadow = true, withBorder = true, ...props},
    ref,
  ) => {
    return (
      <div
        className={cn(
          'rounded-lg bg-background',
          withShadow && 'shadow-sm',
          withBorder && 'border border-border',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Surface.displayName = 'Surface'

export {Surface}
