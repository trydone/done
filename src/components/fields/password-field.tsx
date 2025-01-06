import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React, { ReactNode, useState } from 'react'
import { useController } from 'react-hook-form'

import { FormControl } from '@/components/ui/form-control'
import { Input, InputProps } from '@/components/ui/input'
import { useErrorState } from '@/hooks/use-error-state'

interface Props extends Exclude<InputProps, 'type'> {
  name: string
  label?: ReactNode
  labelRight?: ReactNode
  caption?: ReactNode
  controlLeft?: ReactNode
  control: any
}

export const PasswordField = ({
  label,
  labelRight,
  name,
  caption,
  controlLeft,
  control,
  ...rest
}: Props) => {
  const { field, fieldState } = useController({ name, control })
  const hasError = useErrorState(fieldState, control)

  const [passwordType, setPasswordType] = useState<'password' | 'text'>(
    'password',
  )

  const togglePassword = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password')
  }

  return (
    <FormControl
      label={label}
      labelRight={labelRight}
      caption={caption}
      controlLeft={controlLeft}
      error={hasError ? fieldState.error?.message : null}
      name={name}
    >
      <div className="relative">
        <Input
          {...field}
          {...rest}
          id={name}
          hasError={hasError}
          type={passwordType}
          style={{
            width: 'calc(100% - 49px)',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />

        <button
          type="button"
          onClick={togglePassword}
          className="absolute inset-y-0 right-0 flex h-[52px] items-center rounded-r-2xl border border-input bg-muted px-3 text-sm text-foreground"
        >
          {passwordType === 'password' ? (
            <EyeIcon className="size-6" />
          ) : (
            <EyeOffIcon className="size-6" />
          )}
        </button>
      </div>
    </FormControl>
  )
}
