'use client'

import * as React from 'react'

import { Input } from './input'
import { Label } from './label'
import { Prompt } from './prompt'

export interface RenderPromptProps {
  open: boolean
  title: string
  description: string
  verificationText?: string
  cancelText?: string
  confirmText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const RenderPrompt = ({
  /**
   * @ignore
   */
  open,
  /**
   * The prompt's title.
   */
  title,
  /**
   * The prompt's description.
   */
  description,
  /**
   * The text the user has to input in order to confirm the action.
   */
  verificationText,
  /**
   * The label for the Cancel button.
   */
  cancelText = 'Cancel',
  /**
   * Label for the Confirm button.
   */
  confirmText = 'Confirm',
  /**
   * @ignore
   */
  onConfirm,
  /**
   * @ignore
   */
  onCancel,
}: RenderPromptProps) => {
  const [userInput, setUserInput] = React.useState('')

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value)
  }

  const validInput = React.useMemo(() => {
    if (!verificationText) {
      return true
    }

    return userInput === verificationText
  }, [userInput, verificationText])

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!verificationText) {
      return
    }

    if (validInput) {
      onConfirm()
    }
  }

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onCancel, open])

  return (
    <Prompt open={open}>
      <Prompt.Content>
        <form onSubmit={handleFormSubmit}>
          <Prompt.Header>
            <Prompt.Title>{title}</Prompt.Title>
            <Prompt.Description>{description}</Prompt.Description>
          </Prompt.Header>

          {verificationText && (
            <div className="mb-4 mt-6 flex flex-col gap-y-4">
              <Label htmlFor="verificationText">
                Please type{' '}
                <span className="font-bold">{verificationText}</span> to
                confirm.
              </Label>

              <Input
                autoFocus
                autoComplete="off"
                id="verificationText"
                placeholder={verificationText}
                onChange={handleUserInput}
              />
            </div>
          )}

          <Prompt.Footer>
            <Prompt.Cancel onClick={onCancel}>{cancelText}</Prompt.Cancel>
            <Prompt.Action
              disabled={!validInput}
              type={verificationText ? 'submit' : 'button'}
              onClick={verificationText ? undefined : onConfirm}
            >
              {confirmText}
            </Prompt.Action>
          </Prompt.Footer>
        </form>
      </Prompt.Content>
    </Prompt>
  )
}
RenderPrompt.displayName = 'RenderPrompt'
