import {
  CheckIcon,
  ChevronGrabberVerticalIcon,
  CircleXFilledIcon,
} from '@fingertip/icons'
import * as React from 'react'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input, InputProps } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { ScrollArea } from './scroll-area'

export type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void
    clearable?: boolean
    onClear?: () => void
    clearClassName?: string
  }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    (
      {
        className,
        placeholder = 'Enter phone number',
        onChange,
        clearable,
        onClear,
        clearClassName,
        ...props
      },
      ref,
    ) => {
      return (
        <div className="relative">
          <RPNInput.default
            ref={ref}
            className={cn('flex')}
            flagComponent={FlagComponent}
            countrySelectComponent={CountrySelect}
            placeholder={placeholder}
            inputComponent={InputComponent}
            inputClassName={className}
            /**
             * Handles the onChange event.
             *
             * react-phone-number-input might trigger the onChange event as undefined
             * when a valid phone number is not entered. To prevent this,
             * the value is coerced to an empty string.
             *
             * @param {E164Number | undefined} value - The entered value
             */
            onChange={(value) => onChange?.((value as any) || '')}
            {...props}
          />

          {clearable && !!props.value && (
            <div className="absolute right-0 top-0 flex flex-row gap-1 pr-3">
              <button
                tabIndex={-1}
                className={cn(
                  'flex !h-fluid-12 items-center justify-center !p-0 text-muted-foreground',
                  clearClassName,
                )}
                type="button"
                onClick={() => onClear?.()}
                aria-label="clear input"
              >
                <CircleXFilledIcon
                  width={20}
                  height={20}
                  className="text-muted-foreground/50"
                />
              </button>
            </div>
          )}
        </div>
      )
    },
  )
PhoneInput.displayName = 'PhoneInput'

const InputComponent = React.forwardRef<
  HTMLInputElement,
  InputProps & { inputClassName?: string }
>(({ className, inputClassName, ...props }, ref) => (
  <Input
    className={cn('!rounded-s-none', className, inputClassName)}
    {...props}
    ref={ref}
  />
))
InputComponent.displayName = 'InputComponent'

type CountrySelectOption = { label: string; value: RPNInput.Country }

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  onChange: (value: RPNInput.Country) => void
  options: CountrySelectOption[]
}

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country)
    },
    [onChange],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className="phone-input-country-select-button flex gap-1 !rounded-e-none rounded-s-2xl border-r-0 px-3"
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronGrabberVerticalIcon
            className={cn(
              '-mr-2 h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-72" onWheel={(e) => e.stopPropagation()}>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-sm text-foreground/50">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}
FlagComponent.displayName = 'FlagComponent'

export { PhoneInput }
