import { useMutation } from '@connectrpc/connect-query'
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
import { GetFormFieldsResponse } from '@fingertip/creator-proto/gen/fingertip/creator/form_field/v1/form_field_pb'
import { updateFormField } from '@fingertip/creator-proto/gen/fingertip/creator/form_field/v1/form_field-FormFieldService_connectquery'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import { Field } from '@/components/fields/field'
import { useToken } from '@/lib/hooks/use-token'
import { RootStoreContext } from '@/lib/stores/root-store'

type Props = {
  formTemplateSlug: string
  fields: GetFormFieldsResponse['formFields']
  queryKey: any
}

export const FieldsList = ({ fields, queryKey, formTemplateSlug }: Props) => {
  const [items, setItems] = useState(fields || [])
  const { hasFetched, callOptions } = useToken()

  const {
    formEditorStore: { setIsSaving },
  } = useContext(RootStoreContext)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    setItems(fields || [])
  }, [fields])

  const mutationUpdate = useMutation(updateFormField, {
    callOptions,
    onMutate: async (): Promise<any> => {
      setIsSaving(true)
    },
    onSettled: () => {
      setIsSaving(false)
    },
  })

  const updateFieldPositions = useCallback(
    (newItems: typeof items) => {
      newItems.forEach((item, index) => {
        mutationUpdate.mutate({
          formTemplateSlug,
          formFieldId: String(item.id),
          position: index + 1,
        })
      })
      setItems(newItems)
    },
    [formTemplateSlug, mutationUpdate],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!hasFetched) {
        return
      }

      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        updateFieldPositions(newItems)
      }
    },
    [hasFetched, items, updateFieldPositions],
  )

  const moveField = useCallback(
    (index: number, direction: 'up' | 'down') => {
      if (!hasFetched) {
        return
      }

      const newIndex = direction === 'up' ? index - 1 : index + 1

      if (newIndex >= 0 && newIndex < items.length) {
        const newItems = arrayMove(items, index, newIndex)
        updateFieldPositions(newItems)
      }
    },
    [hasFetched, items, updateFieldPositions],
  )

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((fieldItem, index) => {
            return (
              <Field
                key={fieldItem.id}
                fieldItem={fieldItem}
                fieldIndex={index}
                queryKey={queryKey}
                formTemplateSlug={formTemplateSlug}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onMoveUp={() => moveField(index, 'up')}
                onMoveDown={() => moveField(index, 'down')}
              />
            )
          })}
        </SortableContext>
      </DndContext>
    </>
  )
}
