import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-sans font-medium', {
  variants: {
    level: {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
    },
  },
  defaultVariants: {
    level: 'h1',
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

/**
 * This component is based on the heading element (`h1`, `h2`, etc...) depeneding on the specified level
 * and supports all of its props
 */
const Heading = ({
  /**
   * The heading level which specifies which heading element is used.
   */
  level = 'h1',
  className,
  ...props
}: HeadingProps) => {
  const Component = level || 'h1'

  return (
    <Component
      className={cn(headingVariants({ level }), className)}
      {...props}
    />
  )
}

export { Heading, headingVariants }
