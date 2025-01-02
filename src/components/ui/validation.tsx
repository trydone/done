import { CheckIcon, TriangleExclamationIcon } from '@fingertip/icons'
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { ReactNode } from 'react'

import { Spinner } from '@/components/shared/spinner'
import { cn } from '@/lib/utils/cn'

export const validationVariants = cva(
  'mt-2 flex flex-row items-center text-sm',
  {
    variants: {
      variant: {
        error: 'text-destructive-foreground',
        warning: 'text-warning-foreground',
        success: 'text-success-foreground',
        loading: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'error',
    },
  },
)

type Props = {
  children: ReactNode
  className?: string
} & VariantProps<typeof validationVariants>

export const Validation = ({ children, className, variant }: Props) => {
  return (
    <p className={cn(validationVariants({ variant, className }))}>
      {children}
      {variant === 'error' && (
        <TriangleExclamationIcon width={16} height={16} className="ml-1" />
      )}
      {variant === 'success' && (
        <CheckIcon width={16} height={16} className="ml-1" />
      )}
      {variant === 'warning' && (
        <TriangleExclamationIcon width={16} height={16} className="ml-1" />
      )}
      {variant === 'loading' && (
        <span className="ml-1 ">
          <Spinner size={16} />
        </span>
      )}
    </p>
  )
}
