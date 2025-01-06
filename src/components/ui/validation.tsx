import { cva, VariantProps } from 'class-variance-authority'
import { CheckIcon, TriangleAlertIcon } from 'lucide-react'
import * as React from 'react'
import { ReactNode } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export const validationVariants = cva(
  'mt-2 flex flex-row items-center text-sm',
  {
    variants: {
      variant: {
        error: 'text-destructive-foreground',
        warning: 'text-orange-500',
        success: 'text-green-500',
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
        <TriangleAlertIcon width={16} height={16} className="ml-1" />
      )}
      {variant === 'success' && (
        <CheckIcon width={16} height={16} className="ml-1" />
      )}
      {variant === 'warning' && (
        <TriangleAlertIcon width={16} height={16} className="ml-1" />
      )}
      {variant === 'loading' && (
        <span className="ml-1">
          <Spinner size={16} />
        </span>
      )}
    </p>
  )
}
