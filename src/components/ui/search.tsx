import { MagnifyingGlassIcon } from '@fingertip/icons'
import { ReactNode, useEffect, useState } from 'react'

import { cn } from '@/lib/utils/cn'

import { FormControl } from './form-control'
import { Input, InputProps } from './input'

interface Props extends InputProps {
  label?: ReactNode
  caption?: ReactNode
  value: string
  onSearch: (value: string) => void
  fullWidth?: boolean
  className?: string
  inputClassName?: string
  clearClassName?: string
  searchClassName?: string
  placeholderSuggestions?: string[]
  typingSpeed?: number
  deletingSpeed?: number
}

export const Search = ({
  label,
  placeholder = 'Search...',
  placeholderSuggestions = [],
  value,
  onSearch,
  fullWidth,
  className,
  inputClassName,
  clearClassName,
  searchClassName,
  typingSpeed = 150,
  deletingSpeed = 100,
  ...props
}: Props) => {
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [arrayIndex, setArrayIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (!placeholderSuggestions.length) {
      return
    }

    const currentString = placeholderSuggestions[arrayIndex]
    let timeoutId: any

    if (isDeleting) {
      // Deleting characters
      timeoutId = setTimeout(() => {
        setAnimatedPlaceholder((current) => current.substring(0, charIndex - 1))
        setCharIndex((current) => Math.max(0, current - 1))
        if (charIndex <= 1) {
          setIsDeleting(false)
          setArrayIndex(
            (prevIndex) => (prevIndex + 1) % placeholderSuggestions.length,
          )
          setCharIndex(0) // Reset for the next string
        }
      }, deletingSpeed)
    } else {
      // Adding characters
      if (charIndex < currentString.length) {
        timeoutId = setTimeout(() => {
          setAnimatedPlaceholder(
            (current) => current + currentString[charIndex],
          )
          setCharIndex((current) => current + 1)
        }, typingSpeed)
      }
      if (charIndex === currentString.length) {
        // Wait a bit at the end of the string before starting to delete
        timeoutId = setTimeout(() => setIsDeleting(true), 1000)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [
    charIndex,
    isDeleting,
    arrayIndex,
    placeholderSuggestions,
    typingSpeed,
    deletingSpeed,
  ])

  return (
    <FormControl
      label={label}
      name="search"
      className={cn(className, { 'w-full': fullWidth })}
    >
      <div className="relative">
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-muted-foreground',
            searchClassName,
          )}
        >
          <MagnifyingGlassIcon width={20} height={20} />
        </span>

        <Input
          id="search"
          placeholder={
            placeholderSuggestions.length > 0
              ? animatedPlaceholder
              : placeholder
          }
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          onClear={() => onSearch('')}
          type="text"
          className={cn('pl-9', inputClassName)}
          clearClassName={clearClassName}
          clearable
          {...props}
        />
      </div>
    </FormControl>
  )
}
