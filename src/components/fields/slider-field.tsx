import React, { ReactNode } from 'react'
import { useController } from 'react-hook-form'

import { FormControl } from '@/components/ui/form-control'
import { Slider } from '@/components/ui/slider'

interface Props {
  name: string
  label?: ReactNode
  caption?: ReactNode
  control: any
  disabled?: boolean
  max?: number
  min?: number
  step?: number
  showValue?: boolean
  onChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  className?: string
}

export const SliderField = ({
  name,
  label,
  caption,
  disabled,
  control,
  onChange,
  max,
  min,
  step,
  onValueCommit,
  className,
  ...props
}: Props) => {
  const { field, fieldState } = useController({ name, control })
  const hasError = !!fieldState.error

  return (
    <FormControl
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
      label={label}
      className={className}
    >
      <Slider
        disabled={disabled}
        max={max}
        min={min}
        step={step}
        onValueChange={(value) => onChange?.(value)}
        {...props}
        {...field}
        value={[field.value]}
        id={name}
        onValueCommit={(value) => onValueCommit?.(value)}
      />
    </FormControl>
  )
}
