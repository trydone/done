import {useCombobox} from 'downshift'
import {Check, ChevronDown, User} from 'lucide-react'
import * as React from 'react'

import {cn} from '@/lib/utils'
import {UserRow} from '@/schema'

type Props = {
  members: readonly UserRow[]
  selectedAssigneeId?: string | null
  onAssigneeChange: (member: string | null) => void
}

export const AssigneeSwitcher = ({
  members,
  selectedAssigneeId,
  onAssigneeChange,
}: Props) => {
  const [items, setItems] = React.useState(members)
  const [inputValue, setInputValue] = React.useState('')

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    selectedItem: members.find((member) => selectedAssigneeId === member?.id),
    onSelectedItemChange: ({selectedItem}) => {
      onAssigneeChange(selectedItem.id || null)
    },
    onInputValueChange: ({inputValue}) => {
      setInputValue(inputValue || '')
      setItems(
        members.filter((member) =>
          member.username
            .toLowerCase()
            .includes((inputValue || '').toLowerCase()),
        ),
      )
    },
    itemToString: (item) => item?.username || '',
  })

  return (
    <div className="relative w-[200px]">
      <div className="flex flex-col gap-1">
        <label {...getLabelProps()} className="sr-only">
          Assign to
        </label>
        <div className="relative">
          <div
            className={cn(
              'flex items-center rounded-lg border border-input bg-background',
              isOpen && 'ring-2 ring-ring ring-offset-2',
            )}
          >
            <input
              {...getInputProps({
                onFocus: () => {
                  if (!isOpen) {
                    setItems(members)
                  }
                },
              })}
              className="w-full rounded-lg bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search assignee..."
            />
            <button
              {...getToggleButtonProps()}
              aria-label="toggle menu"
              className="flex h-full items-center border-l border-input px-2"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        {...getMenuProps()}
        className={cn(
          'absolute z-50 mt-1 max-h-[300px] w-full overflow-auto rounded-lg border border-input bg-popover shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          !isOpen && 'hidden',
        )}
      >
        <div className="p-1">
          {inputValue.length === 0 && (
            <div
              {...getItemProps({
                item: null,
                index: -1,
              })}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                highlightedIndex === -1
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <User className="size-4" />
              <span>No Assignee</span>
              {!selectedAssigneeId && <Check className="ml-auto size-4" />}
            </div>
          )}

          {items.map((member, index) => (
            <div
              key={member?.id || index}
              {...getItemProps({
                item: member,
                index,
              })}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                highlightedIndex === index
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <div className="relative size-6 rounded-full bg-muted">
                <span className="flex size-full items-center justify-center text-xs">
                  {member?.username
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <span>{member?.username}</span>
              {selectedAssigneeId === member?.id && (
                <Check className="ml-auto size-4" />
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
