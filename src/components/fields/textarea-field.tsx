import React, { ReactNode } from 'react'
import { useController } from 'react-hook-form'

import { FormControl } from '@/components/ui/form-control'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { useErrorState } from '@/hooks/use-error-state'

interface Props extends TextareaProps {
  name: string
  label?: ReactNode
  caption?: ReactNode
  control: any
  minRows?: number
  className?: string
  captionClassName?: string
  inputClassName?: string
  labelClassName?: string
}

export const TextareaField = ({
  label,
  name,
  caption,
  control,
  disabled,
  className,
  labelClassName,
  inputClassName,
  captionClassName,
  ...rest
}: Props) => {
  const { field, fieldState } = useController({ name, control })
  const hasError = useErrorState(fieldState, control)

  return (
    <FormControl
      label={label}
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
      captionClassName={captionClassName}
      className={className}
      labelClassName={labelClassName}
    >
      <Textarea
        {...field}
        {...rest}
        id={name}
        hasError={hasError}
        disabled={disabled}
        className={inputClassName}
      />
    </FormControl>
  )
}
