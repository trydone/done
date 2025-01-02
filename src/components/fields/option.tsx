import { PartialMessage } from '@bufbuild/protobuf'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Option as ProtoOption } from '@fingertip/creator-proto/gen/fingertip/common/type/v1/form_field_schema_pb'
import { CrossLargeIcon, DotGrid2x3VerticalIcon } from '@fingertip/icons'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

type Props = {
  options: PartialMessage<ProtoOption>[]
  optionItem: PartialMessage<ProtoOption>
  setOptions: (options: PartialMessage<ProtoOption>[]) => void
}

export const Option = ({ options, optionItem, setOptions }: Props) => {
  const [label, setLabel] = useState(optionItem.label)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: optionItem?.id || '' })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const editOption = useCallback(
    (value: any) => {
      let newOptions = [...options]
      const foundIndex = newOptions.findIndex(
        (option: any) => option.id === optionItem.id,
      )

      if (foundIndex > -1) {
        newOptions[foundIndex] = { ...newOptions[foundIndex], label: value }
      } else {
        newOptions = [...newOptions, { id: optionItem.id, label: value }]
      }

      setOptions(newOptions)
    },
    [optionItem.id, options, setOptions],
  )

  const deleteOption = useCallback(() => {
    const newOptions = options.filter((option) => option.id !== optionItem.id)

    setOptions(newOptions)
  }, [optionItem.id, options, setOptions])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative w-full rounded-2xl sm:px-2 transition-colors mb-4',
        {
          'z-[100] cursor-grabbing': isDragging,
        },
      )}
    >
      <div className="flex w-full">
        <div className="flex items-center justify-between">
          <div
            className="mr-3 cursor-pointer touch-none"
            {...attributes}
            {...listeners}
          >
            <DotGrid2x3VerticalIcon className="size-6" />
          </div>
        </div>

        <Input
          type="text"
          name="label"
          value={label}
          autoFocus={label === ''}
          placeholder="E.g. First name"
          onChange={(event) => setLabel(event.target.value)}
          onBlur={(event) => editOption(event.target.value)}
        />

        <Button
          type="button"
          variant="muted"
          className="ml-3"
          onClick={() => deleteOption()}
        >
          <CrossLargeIcon width={16} height={16} />
        </Button>
      </div>
    </div>
  )
}
