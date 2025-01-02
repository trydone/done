import * as React from 'react'
import { useCallback } from 'react'

import { generateTimeOptions } from '@/components/booking/schedule'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const timeOptions = generateTimeOptions()

type Props = {
  time: string
  onChange: (time: string) => void
}

export const TimePicker = ({ time, onChange }: Props) => {
  const [timeValue, setTimeValue] = React.useState<string | undefined>(time)

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const changeHandler = useCallback(
    (newTime: string) => {
      setTimeValue(newTime)
      onChange(newTime)
    },
    [onChange],
  )

  return (
    <Select value={timeValue} onValueChange={changeHandler}>
      <SelectTrigger className="flex h-[36px] w-[120px] rounded-xl text-sm">
        <SelectValue placeholder="Start time">
          {timeValue ? formatTime(timeValue) : 'Start time'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[250px]">
        {timeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
