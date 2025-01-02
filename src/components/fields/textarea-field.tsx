import React, { ReactNode, useCallback, useState } from 'react'
import { useController } from 'react-hook-form'

import { FormControl } from '@/components/ui/form-control'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { useErrorState } from '@/lib/hooks/use-error-state'

import { AskAI } from '../ai/ask-ai'
import { AskAiButton } from '../ai/ask-ai-button'
import { ListMenuContent } from '../ui/list'

interface Props extends TextareaProps {
  name: string
  label?: ReactNode
  caption?: ReactNode
  control: any
  minRows?: number
  ai?: boolean
  setValue?: any
  suggestions?: string[][]
  format?: string
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
  ai,
  setValue,
  suggestions,
  format,
  className,
  labelClassName,
  inputClassName,
  captionClassName,
  ...rest
}: Props) => {
  const [open, setOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const { field, fieldState } = useController({ name, control })
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
      labelRight={ai && <AskAiButton open={open} setOpen={setOpen} />}
      captionClassName={captionClassName}
      className={className}
      labelClassName={labelClassName}
    >
      <Textarea
        {...field}
        {...rest}
        id={name}
        hasError={hasError}
        disabled={disabled || isCompleting}
        className={inputClassName}
      />

      {ai && open && (
        <ListMenuContent className="mb-3 mt-1 rounded-2xl">
          <AskAI
            content={watchContent}
            setContent={setContent}
            setIsCompleting={setIsCompleting}
            suggestions={suggestions}
            format={format}
            setOpen={setOpen}
          />
        </ListMenuContent>
      )}
    </FormControl>
  )
}
