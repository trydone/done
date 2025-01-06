import React, {ReactNode} from 'react'

import {Label} from '@/components/ui/label'
import {cn} from '@/lib/utils'

import {Validation} from './validation'

export type FormControlProps = {
  name: string
  label?: ReactNode
  labelRight?: ReactNode
  error?: ReactNode
  success?: ReactNode
  warning?: ReactNode
  loading?: ReactNode
  caption?: ReactNode
  controlLeft?: ReactNode
  children: ReactNode
  className?: string
  validationPosition?: 'left' | 'right'
  captionClassName?: string
  labelClassName?: string
}

export const FormControl = ({
  label,
  labelRight,
  controlLeft,
  name,
  caption,
  error,
  loading,
  success,
  warning,
  children,
  className,
  validationPosition = 'left',
  captionClassName,
  labelClassName,
}: FormControlProps) => {
  return (
    <div className={cn('mb-4 flex flex-col', className)}>
      {(label || labelRight) && (
        <div className="mb-2 flex justify-between">
          <div>
            {label && (
              <Label
                htmlFor={name}
                className={cn('cursor-pointer', labelClassName)}
              >
                {label}
              </Label>
            )}
          </div>

          <div>{labelRight}</div>
        </div>
      )}

      {children}

      {caption && (
        <span
          className={cn('mt-1 text-sm text-muted-foreground', captionClassName)}
        >
          {caption}
        </span>
      )}

      {controlLeft && <div className="mt-1">{controlLeft}</div>}

      <div
        className={cn('flex flex-row', {
          'justify-end': validationPosition === 'right',
          'justify-start': validationPosition === 'left',
        })}
      >
        {success && <Validation variant="success">{success}</Validation>}
        {warning && <Validation variant="warning">{warning}</Validation>}
        {error && <Validation variant="error">{error}</Validation>}
        {loading && <Validation variant="loading">{loading}</Validation>}
      </div>
    </div>
  )
}
