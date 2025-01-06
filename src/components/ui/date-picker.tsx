import {format} from 'date-fns'
import {Calendar1Icon, CircleXIcon} from 'lucide-react'
import * as React from 'react'
import {useCallback} from 'react'
import {SelectSingleEventHandler} from 'react-day-picker'

import {Button} from '@/components/ui/button'
import {Calendar, CalendarProps} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'

type Props = CalendarProps & {
  date?: Date
  setDate: (value: Date | undefined) => void
  isClearable?: boolean
  disabled?: boolean
  children?: React.ReactNode
}

export const DatePicker = ({
  date,
  setDate,
  isClearable,
  disabled,
  children,
  ...props
}: Props) => {
  const [open, setOpen] = React.useState(false)

  const onDateSelect = useCallback<SelectSingleEventHandler>(
    (date) => {
      setDate(date)
      setOpen(false)
    },
    [setDate],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {children ? (
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <div className="relative flex items-center">
            <Button
              type="button"
              variant="input"
              disabled={disabled}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <Calendar1Icon className="mr-2 size-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>

            {!!date && isClearable && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDate(undefined)}
                className="absolute right-0 top-0 flex flex-row gap-1 pr-3"
              >
                <CircleXIcon
                  width={20}
                  height={20}
                  className="text-muted-foreground/50"
                />
              </Button>
            )}
          </div>
        </PopoverTrigger>
      )}

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...props}
          mode="single"
          selected={date}
          onSelect={onDateSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
