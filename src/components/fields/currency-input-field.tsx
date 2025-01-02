import React, { ReactNode, useCallback } from 'react'
import { useController } from 'react-hook-form'

import { CurrencyInput, type InputProps } from '@/components/ui/currency-input'
import { FormControl } from '@/components/ui/form-control'
import { getCurrencySymbol } from '@/lib/dinero/utils'
import { useErrorState } from '@/lib/hooks/use-error-state'

interface Props extends InputProps {
  name: string
  label?: ReactNode
  caption?: ReactNode
  control: any
  className?: string
  captionClassName?: string
  labelClassName?: string
  inputClassName?: string
  disabled?: boolean
  currency: string
  placeholder?: string
  decimalsLimit?: number
  setValue: any
  leftAddon?: ReactNode | null
}

export const CurrencyInputField = ({
  label,
  name,
  control,
  caption,
  className,
  inputClassName,
  captionClassName,
  disabled,
  placeholder,
  decimalsLimit = 2,
  setValue,
  currency,
  leftAddon,
  labelClassName,
}: Props) => {
  const { field, fieldState } = useController({ control, name })
  const hasError = useErrorState(fieldState, control)

  const handleValueChange = useCallback(
    (value: string | undefined) => {
      if (!value) {
        setValue(name, '')
      } else {
        setValue(name, value)
      }
    },
    [name, setValue],
  )

  return (
    <FormControl
      label={label}
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
      className={className}
      labelClassName={labelClassName}
      captionClassName={captionClassName}
    >
      <CurrencyInput
        id={name}
        className={`${inputClassName} ${hasError ? 'border-red-500' : ''}`}
        disabled={disabled}
        placeholder={placeholder || '0.00'}
        leftAddon={
          leftAddon === null ? null : leftAddon || getCurrencySymbol(currency)
        }
        decimalsLimit={decimalsLimit}
        onValueChange={handleValueChange}
        value={field.value}
      />
    </FormControl>
  )
}
