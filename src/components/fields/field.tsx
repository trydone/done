import { PartialMessage } from '@bufbuild/protobuf'
import { useMutation } from '@connectrpc/connect-query'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormFieldType } from '@fingertip/creator-proto/gen/fingertip/common/enum/v1/form_field_type_pb'
import {
  FormFieldSchema,
  Option as ProtoOption,
} from '@fingertip/creator-proto/gen/fingertip/common/type/v1/form_field_schema_pb'
import { GetFormFieldsResponse } from '@fingertip/creator-proto/gen/fingertip/creator/form_field/v1/form_field_pb'
import {
  deleteFormField,
  updateFormField,
} from '@fingertip/creator-proto/gen/fingertip/creator/form_field/v1/form_field-FormFieldService_connectquery'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotGrid2x3HorizontalIcon,
  TrashCanSimpleIcon,
} from '@fingertip/icons'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useContext, useState } from 'react'
import { toast } from 'sonner'

import { OptionList } from '@/components/fields/option-list'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { FormControl } from '@/components/ui/form-control'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToken } from '@/lib/hooks/use-token'
import { RootStoreContext } from '@/lib/stores/root-store'
import { cn } from '@/lib/utils/cn'

type Props = {
  formTemplateSlug: string
  fieldIndex: number
  fieldItem: GetFormFieldsResponse['formFields'][number]
  queryKey: any
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
}

export const Field = ({
  formTemplateSlug,
  fieldItem,
  fieldIndex,
  queryKey,
  isFirst,
  isLast,
  onMoveDown,
  onMoveUp,
}: Props) => {
  const queryClient = useQueryClient()
  const { hasFetched, callOptions } = useToken()

  const {
    formEditorStore: { setIsSaving },
  } = useContext(RootStoreContext)

  const content = fieldItem?.content

  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState<FormFieldSchema['label']>(
    content?.label || '',
  )
  const [instruction, setInstruction] = useState<
    FormFieldSchema['instruction']
  >(content?.instruction || '')
  const [kind, setKind] = useState<number>(content?.kind || FormFieldType.TEXT)
  const [required, setRequired] = useState<FormFieldSchema['required']>(
    content?.required || false,
  )
  const [options, setOptions] = useState<PartialMessage<ProtoOption>[]>(
    content?.options || [],
  )

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldItem.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const mutationUpdate = useMutation(updateFormField, {
    callOptions,
    onMutate: async (variables): Promise<any> => {
      setIsSaving(true)
      await queryClient.cancelQueries({ queryKey: queryKey })

      const previousFields = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        const fields = old?.formFields || []
        const foundFieldIndex = fields.findIndex(
          (field: any) => field.id === fieldItem.id,
        )

        fields[foundFieldIndex] = {
          ...fields[foundFieldIndex],
          content: variables.content,
        }

        return { formFields: fields }
      })

      return { previousFields }
    },
    onError: (error, _, context: any) => {
      queryClient.setQueryData(queryKey, context?.previousFields)
      toast.error(error.message)
    },
    onSettled: () => {
      setIsSaving(false)
    },
  })

  const mutationDelete = useMutation(deleteFormField, {
    callOptions,
    onMutate: async (): Promise<any> => {
      await queryClient.cancelQueries({ queryKey: queryKey })

      const previousFields = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        let fields = old?.formFields || []

        fields = fields.filter((field: any) => field.id !== fieldItem.id)

        return { formFields: fields }
      })

      return { previousFields }
    },
    onError: (error, _, context: any) => {
      queryClient.setQueryData(queryKey, context?.previousFields)
      toast.error(error.message)
    },
  })

  const editField = useCallback(
    (key: string, value: any) => {
      if (!hasFetched) {
        return
      }

      const newContent = {
        ...content,
        label,
        instruction,
        kind,
        required,
        options,
        [key]: value,
      }

      mutationUpdate.mutate({
        formTemplateSlug,
        formFieldId: fieldItem.id,
        content: newContent,
      })
    },
    [
      content,
      fieldItem.id,
      formTemplateSlug,
      instruction,
      kind,
      label,
      mutationUpdate,
      options,
      required,
      hasFetched,
    ],
  )

  const deleteField = useCallback(() => {
    if (!hasFetched) {
      return
    }

    mutationDelete.mutate({
      formTemplateSlug,
      formFieldId: fieldItem.id,
    })
  }, [fieldItem.id, formTemplateSlug, mutationDelete, hasFetched])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative w-full rounded-2xl bg-card px-4 pb-2 shadow-md border border-border transition-colors mb-4',
        {
          'z-[100] cursor-grabbing shadow-lg shadow-black/10': isDragging,
        },
      )}
    >
      <div className="flex items-center justify-center">
        <div
          className="mr-3 cursor-pointer touch-none text-foreground"
          {...attributes}
          {...listeners}
        >
          <DotGrid2x3HorizontalIcon className="size-6" />
        </div>
      </div>

      <div className="flex flex-col space-x-0">
        <div className="w-full">
          <FormControl
            label={
              kind === FormFieldType.HEADING
                ? 'Heading text'
                : `Question #${fieldIndex + 1}`
            }
            name={`label-${fieldIndex}`}
          >
            <Textarea
              name="label"
              id={`label-${fieldIndex}`}
              value={label}
              autoFocus={label === ''}
              placeholder={
                kind === FormFieldType.HEADING
                  ? 'Enter your heading'
                  : `Enter your question`
              }
              onChange={(event) => setLabel(event.target.value)}
              onBlur={(event) => editField('label', event.target.value)}
              clearable
              onClear={() => setLabel('')}
            />
          </FormControl>
        </div>

        <div className="w-full">
          <FormControl
            name={`kind-${fieldIndex}`}
            label="Field type"
            className="w-full"
          >
            <Select
              name="kind"
              value={kind.toString()}
              onValueChange={(value) => {
                setKind(parseInt(value))
                editField('kind', parseInt(value))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose field kind" />
              </SelectTrigger>

              <SelectContent className="max-h-[250px] max-w-[250px]">
                <SelectGroup>
                  <SelectItem value={`${FormFieldType.HEADING}`}>
                    Heading
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.TEXT}`}>
                    Short answer
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.TEXTAREA}`}>
                    Paragraph
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.NUMBER}`}>
                    Number
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.NAME}`}>Name</SelectItem>
                  <SelectItem value={`${FormFieldType.RADIO}`}>
                    Multiple choice
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.CHECKBOX}`}>
                    Checkboxes
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.SELECT}`}>
                    Dropdown
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.EMAIL}`}>
                    Email
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.PHONE}`}>
                    Phone
                  </SelectItem>
                  <SelectItem value={`${FormFieldType.DATE}`}>Date</SelectItem>
                  <SelectItem value={`${FormFieldType.TIME}`}>Time</SelectItem>
                  <SelectItem value={`${FormFieldType.FILE}`}>File</SelectItem>
                  <SelectItem value={`${FormFieldType.SIGNATURE}`}>
                    Signature
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
        </div>
      </div>

      {[
        FormFieldType.RADIO,
        FormFieldType.CHECKBOX,
        FormFieldType.SELECT,
      ].includes(kind) && (
        <OptionList
          options={options}
          setOptions={(options) => {
            setOptions(options)
            editField('options', options)
          }}
        />
      )}

      <FormControl
        name={`instruction-${fieldIndex}`}
        label={
          kind === FormFieldType.HEADING
            ? 'Description (optional)'
            : 'Instructions (optional)'
        }
      >
        <Textarea
          name={`instruction-${fieldIndex}`}
          value={instruction}
          rows={2}
          placeholder="E.g. Enter your preferred first name"
          onChange={(event) => setInstruction(event.target.value)}
          onBlur={(event) => editField('instruction', event.target.value)}
          clearable
          onClear={() => setInstruction('')}
        />
      </FormControl>

      <div className="flex items-center justify-between">
        <div className="flex flex-row">
          {kind !== FormFieldType.HEADING && (
            <div className="flex items-center space-x-2">
              <Switch
                name="required"
                checked={required}
                onCheckedChange={(value) => {
                  setRequired(value)
                  editField('required', value)
                }}
              />

              <label
                htmlFor="required"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Required
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ArrowUpIcon width={14} height={14} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ArrowDownIcon width={14} height={14} />
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
              <div
                className={cn(
                  buttonVariants({
                    variant: 'destructiveSecondary',
                    size: 'sm',
                  }),
                )}
              >
                <TrashCanSimpleIcon width={14} height={14} />
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove field</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this field?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteField} variant="destructive">
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
