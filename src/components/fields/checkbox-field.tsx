import React, { ReactNode } from 'react'
import { useController } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl } from '@/components/ui/form-control'
import { Switch } from '@/components/ui/switch'

interface Props {
  id?: string
  name: string
  label?: ReactNode
  caption?: ReactNode
  control: any
  children?: ReactNode
  disabled?: boolean
  switchToggle?: boolean
  onChange?: (value: boolean | 'indeterminate') => void
  className?: string
  captionClassName?: string
  labelClassName?: string
}

export const CheckboxField = ({
  id,
  name,
  label,
  caption,
  disabled,
  children,
  control,
  onChange,
  switchToggle,
  className,
  captionClassName,
  labelClassName,
  ...props
}: Props) => {
  const { field, fieldState } = useController({ name, control })
  const hasError = !!fieldState.error

  return (
    <FormControl
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
      className={className}
      labelClassName={labelClassName}
      captionClassName={captionClassName}
    >
      <div className="flex items-center space-x-2">
        {switchToggle ? (
          <Switch
            disabled={disabled}
            checked={field.value}
            onCheckedChange={(value) => {
              field.onChange?.(value)
              onChange?.(value)
            }}
            {...props}
            {...field}
            id={id || name}
          />
        ) : (
          <Checkbox
            disabled={disabled}
            checked={field.value}
            onCheckedChange={(value) => {
              field.onChange?.(value)
              onChange?.(value)
            }}
            {...props}
            {...field}
            id={id || name}
          />
        )}

        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label ?? children}
        </label>
      </div>
    </FormControl>
  )
}
