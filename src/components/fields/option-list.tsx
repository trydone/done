import { PartialMessage } from '@bufbuild/protobuf'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Option as ProtoOption } from '@fingertip/creator-proto/gen/fingertip/common/type/v1/form_field_schema_pb'
import { useCallback } from 'react'
import { v4 } from 'uuid'

import { Option } from '@/components/fields/option'
import { Button } from '@/components/ui/button'

type Props = {
  options: PartialMessage<ProtoOption>[]
  setOptions: (options: PartialMessage<ProtoOption>[]) => void
}

export const OptionList = ({ options, setOptions }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const addOption = useCallback(() => {
    const newItems = [
      ...options,
      {
        id: v4(),
        label: '',
      },
    ]

    setOptions(newItems)
  }, [options, setOptions])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = options.findIndex((item: any) => item.id === active.id)
        const newIndex = options.findIndex((item: any) => item.id === over?.id)
        const newOptions = arrayMove(options, oldIndex, newIndex)

        setOptions(newOptions)
      }
    },
    [options, setOptions],
  )

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={options as any}
          strategy={verticalListSortingStrategy}
        >
          {options.map((optionItem: any) => (
            <Option
              key={optionItem.id}
              optionItem={optionItem}
              setOptions={setOptions}
              options={options}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="mb-2">
        <Button
          variant={options.length > 0 ? 'secondary' : 'default'}
          size="sm"
          onClick={addOption}
          type="button"
        >
          Add an option
        </Button>
      </div>
    </>
  )
}
