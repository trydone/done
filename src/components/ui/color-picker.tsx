import { CheckIcon, ChevronDownIcon } from '@fingertip/icons'
import React, { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { calendarColorSwatches } from '@/lib/data/color-swatches'

type Props = {
  color: string
  onSelect: (color: string) => void
  label?: string
}

export const ColorPicker = ({ color, onSelect, label = 'Colour' }: Props) => {
  const [open, setOpen] = useState(false)

  const onSelectColor = useCallback(
    (value: string) => {
      onSelect(value)
      setOpen(false)
    },
    [onSelect],
  )

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
      }}
    >
      <PopoverTrigger
        onClick={(e) => {
          e.preventDefault()
          setOpen(!open)
        }}
        className="flex items-center space-x-1"
      >
        <div
          className="size-5 max-h-5 min-w-5"
          id="color-picker-swatch"
          style={{
            backgroundColor: color,
          }}
        />

        <ChevronDownIcon width={16} height={16} />
      </PopoverTrigger>

      <PopoverContent className="w-full p-2" align="center">
        <div className="mb-2">
          <Label>{label}</Label>
        </div>

        <div className="grid grid-cols-6 grid-rows-4 gap-2">
          {calendarColorSwatches.map((item, index) => {
            return (
              <Button
                type="button"
                onClick={() => onSelectColor(item.hex)}
                variant="ghost"
                className="relative h-6 !p-0"
                key={index}
              >
                <div
                  className="size-6 max-h-6 min-w-6 rounded-full"
                  style={{ backgroundColor: item.hex }}
                />
                {item.hex === color && (
                  <CheckIcon
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                    width={16}
                    height={16}
                  />
                )}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
