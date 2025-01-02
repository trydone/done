import React, { ReactNode, useCallback, useState } from 'react'
import { useController } from 'react-hook-form'

import { FormControl } from '@/components/ui/form-control'
import { Input, InputProps } from '@/components/ui/input'
import { useErrorState } from '@/lib/hooks/use-error-state'

import { AskAI } from '../ai/ask-ai'
import { AskAiButton } from '../ai/ask-ai-button'
import { ListMenuContent } from '../ui/list'

interface Props extends InputProps {
  name: string
  label?: ReactNode
  caption?: ReactNode
  control: any
  className?: string
  captionClassName?: string
  labelClassName?: string
  inputClassName?: string
  ai?: boolean
  setValue?: any
  suggestions?: string[][]
}

export const InputField = ({
  label,
  name,
  control,
  caption,
  className,
  inputClassName,
  labelClassName,
  captionClassName,
  disabled,
  ai,
  setValue,
  suggestions,
  ...rest
}: Props) => {
  const [open, setOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const { field, fieldState } = useController({ control, name })
  const hasError = useErrorState(fieldState, control)

  const watchContent = field.value

  const setContent = useCallback(
    (content: string) => {
      setValue(name, content)
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
      labelRight={ai && <AskAiButton open={open} setOpen={setOpen} />}
      captionClassName={captionClassName}
      labelClassName={labelClassName}
    >
      <Input
        {...field}
        {...rest}
        id={name}
        hasError={hasError}
        className={inputClassName}
        disabled={disabled || isCompleting}
      />

      {ai && open && (
        <ListMenuContent className="mb-3 mt-1 rounded-2xl">
          <AskAI
            content={watchContent}
            setContent={setContent}
            setIsCompleting={setIsCompleting}
            suggestions={suggestions}
            setOpen={setOpen}
          />
        </ListMenuContent>
      )}
    </FormControl>
  )
}
