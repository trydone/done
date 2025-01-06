import { Calendar1Icon } from 'lucide-react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type DateRangeOption = { id: string; label: string; value: DateRange }

type Props = {
  options: DateRangeOption[]
  dateRangeOption: DateRangeOption | undefined
  setDateRangeOption: (value: DateRangeOption | undefined) => void
} & React.HTMLAttributes<HTMLDivElement>

export const DateRangeDropdown = ({
  className,
  options,
  dateRangeOption,
  setDateRangeOption,
}: Props) => {
  const handleChange = React.useCallback(
    (option: DateRangeOption) => {
      setDateRangeOption(option)
    },
    [setDateRangeOption],
  )

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="w-[300px] justify-start">
            <Calendar1Icon className="mr-2 size-4" />
            <span>
              {dateRangeOption ? dateRangeOption?.label : 'Select a date range'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.label}
              onClick={() => handleChange(option)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
