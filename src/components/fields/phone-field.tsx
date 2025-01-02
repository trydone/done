import React, { ReactNode } from 'react'
import { useController } from 'react-hook-form'

import { FormControl } from '@/components/ui/form-control'
import { PhoneInput, type PhoneInputProps } from '@/components/ui/phone-input'
import { useErrorState } from '@/lib/hooks/use-error-state'

interface Props extends PhoneInputProps {
  name: string
  label?: ReactNode
  caption?: ReactNode
  control: any
  className?: string
  captionClassName?: string
  labelClassName?: string
  inputClassName?: string
  phoneInputClassName?: string
}

export const PhoneField = ({
  label,
  name,
  control,
  caption,
  className,
  inputClassName,
  captionClassName,
  labelClassName,
  ...rest
}: Props) => {
  const { field, fieldState } = useController({ control, name })
  const hasError = useErrorState(fieldState, control)

  return (
    <FormControl
      label={label}
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
      className={className}
      captionClassName={captionClassName}
      labelClassName={labelClassName}
    >
      <PhoneInput
        {...field}
        {...rest}
        id={name}
        // hasError={hasError}
        className={inputClassName}
      />
    </FormControl>
  )
}
