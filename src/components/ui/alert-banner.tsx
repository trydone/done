import { CheckIcon, CrossIcon, InfoIcon } from 'lucide-react'
import { ReactNode } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  children?: ReactNode
  title?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
}

export const iconClassName =
  'mr-3 flex size-6 min-w-6 items-center justify-center rounded-full'

export const AlertBanner = ({
  children,
  title = 'Error',
  variant = 'destructive',
  className,
}: Props) => {
  return (
    <div className={cn('mb-4', className)}>
      <Alert variant={variant}>
        <div className="flex">
          {variant === 'destructive' && (
            <div className={cn(iconClassName, 'bg-destructive')}>
              <CrossIcon
                width={14}
                height={14}
                className="stroke-[3px] text-red-200"
              />
            </div>
          )}

          {variant === 'success' && (
            <div className={cn(iconClassName, 'bg-success')}>
              <CheckIcon
                width={14}
                height={14}
                className="stroke-[3px] text-green-200"
              />
            </div>
          )}

          {variant === 'warning' && (
            <div className={cn(iconClassName, 'bg-warning')}>
              <InfoIcon
                width={14}
                height={14}
                className="stroke-[3px] text-orange-200"
              />
            </div>
          )}

          {variant === 'default' && (
            <div className={cn(iconClassName, 'bg-info')}>
              <InfoIcon
                width={14}
                height={14}
                className="stroke-[3px] text-blue-200"
              />
            </div>
          )}

          <div>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  )
}
