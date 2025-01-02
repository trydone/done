import { ChevronDownIcon, CrossLargeIcon } from '@fingertip/icons'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionStateChange,
} from 'downshift'
import lodashSnakeCase from 'lodash/snakeCase'
import lodashUniqBy from 'lodash/uniqBy'
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils/cn'

import { Badge, BadgeProps } from './badge'
import { ComboboxOption } from './combobox'

export type MultiComboBoxOption = ComboboxOption & {
  variant?: BadgeProps['variant']
}

export type OnMultiChangeParams =
  | ((changes: UseMultipleSelectionStateChange<MultiComboBoxOption>) => void)
  | undefined
export type MultiComboboxProps = {
  options: MultiComboBoxOption[]
  values?: MultiComboBoxOption[]
  onChange?: OnMultiChangeParams
  onInputChange?: (value: string) => void
  maxDropdownHeight?: number
  startOpen?: boolean
  create?: boolean
  id?: string
  ref?: any
  placeholder?: string
  inputClassName?: string
}

const getFilteredOptions = (
  options: MultiComboBoxOption[],
  selectedItems: MultiComboBoxOption[],
  inputValue: string,
) => {
  const lowerCasedInputValue = inputValue.toLowerCase()

  return options.filter((option) => {
    return (
      !selectedItems.find(({ id }) => id === option.id) &&
      (option?.label || '').toLowerCase().includes(lowerCasedInputValue)
    )
  })
}

export const MultiComboBox: React.FC<MultiComboboxProps> = forwardRef(
  (
    {
      options,
      values,
      onChange,
      onInputChange,
      startOpen,
      placeholder = 'Filter',
      create = false,
      id,
      inputClassName,
    },
    ref,
  ) => {
    values ??= []
    const [inputValue, setInputValue] = useState('')
    const [selectedItems, setSelectedItems] = useState(values)
    const items = useMemo(
      () => getFilteredOptions(options, selectedItems, inputValue),
      [options, selectedItems, inputValue],
    )
    const {
      getSelectedItemProps,
      getDropdownProps,
      removeSelectedItem,
      addSelectedItem,
    } = useMultipleSelection({
      selectedItems,
      // Handle removal
      onStateChange(data) {
        const { selectedItems: newSelectedItems, type } = data
        // For some reason we get multiple of the same option when selecting
        // a predefined option.
        const uniqueItems = lodashUniqBy(newSelectedItems, ({ id }) => id)
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          case useMultipleSelection.stateChangeTypes.FunctionAddSelectedItem:
            setSelectedItems(uniqueItems)
            break
          default:
            break
        }
        if (onChange) {
          onChange({ selectedItems: uniqueItems, type })
        }
      },
    })
    const {
      isOpen,
      getToggleButtonProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      setInputValue: comboBoxSetInputValue,
    } = useCombobox({
      labelId: id,
      items,
      itemToString(item) {
        return item?.label || ''
      },
      defaultHighlightedIndex: 0, // after selection, highlight the first item.
      selectedItem: null,
      initialIsOpen: startOpen,
      onStateChange(changes) {
        const localSelectedItems: MultiComboBoxOption[] = selectedItems
        if (changes.selectedItem) {
          localSelectedItems.push(changes.selectedItem)
        }
        switch (changes.type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick: {
            if (changes.selectedItem) {
              addSelectedItem(changes.selectedItem)
            }
            setInputValue('')
            if (onChange) {
              onChange({
                selectedItems: localSelectedItems,
                type: useMultipleSelection.stateChangeTypes.SelectedItemClick,
              })
            }
            break
          }
          case useCombobox.stateChangeTypes.InputChange: {
            setInputValue('')
            onInputChange?.(changes.inputValue || '')
            break
          }
          default:
            break
        }
      },
    })

    const handleCreate = () => {
      if (!inputValue) {
        return
      }
      const newItem = {
        id: lodashSnakeCase(inputValue),
        label: inputValue,
      }
      addSelectedItem(newItem)
      setInputValue('')
      comboBoxSetInputValue('')
    }

    const comboboxRef = useRef<HTMLInputElement>(null)
    const listboxRef = useRef<HTMLDivElement>(null)
    const shouldCreate = create && inputValue

    const clearInput = () => {
      comboBoxSetInputValue('')
    }

    useImperativeHandle(ref, () => ({
      clearInput,
    }))

    return (
      <PopoverPrimitive.Root defaultOpen={startOpen} open={isOpen}>
        <PopoverPrimitive.Anchor asChild>
          <div
            className={cn(
              'flex min-h-[52px] grow appearance-none rounded-2xl border-[1.5px] border-input bg-card bg-clip-border text-base hover:border-input-hover focus-within:border-ring focus-within:outline-none',
              inputClassName,
            )}
          >
            <button
              aria-label="toggle menu"
              className="relative flex grow bg-none px-3"
              type="button"
              {...getToggleButtonProps()}
            >
              <span className="flex min-h-[52px] grow flex-wrap items-center gap-2 bg-transparent py-1">
                {selectedItems.map(
                  function renderSelectedItem(selectedItemForRender, index) {
                    return (
                      <Badge
                        key={`selected-item-${index}`}
                        {...getSelectedItemProps({
                          selectedItem: selectedItemForRender,
                          index,
                        })}
                        variant={selectedItemForRender?.variant}
                      >
                        {selectedItemForRender.label}
                        <span
                          className="cursor-pointer pl-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSelectedItem(selectedItemForRender)
                          }}
                        >
                          <CrossLargeIcon width={14} height={14} />
                        </span>
                      </Badge>
                    )
                  },
                )}
                <input
                  data-testid="the-input"
                  className="grow bg-transparent outline-none placeholder:text-placeholder-foreground"
                  placeholder={selectedItems.length === 0 ? placeholder : ''}
                  {...getInputProps(
                    getDropdownProps({ preventKeyAction: isOpen, id }),
                  )}
                  onClick={() => {}}
                />
              </span>

              <div className="flex h-full items-center">
                <ChevronDownIcon width={20} height={20} color="currentColor" />
              </div>
            </button>
          </div>
        </PopoverPrimitive.Anchor>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            className="popover-content relative z-[110] max-h-[250px] min-w-32 translate-y-1 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-soft animate-in fade-in-80"
            asChild
            onOpenAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              const target = event.target as Element | null
              const isCombobox = target === comboboxRef.current
              const inListbox = target && listboxRef.current?.contains(target)
              if (isCombobox || inListbox) {
                event.preventDefault()
              }
            }}
          >
            <div
              className="w-full overflow-y-auto p-1"
              {...getMenuProps({}, { suppressRefError: true })}
            >
              {shouldCreate && (
                <div
                  onClick={handleCreate}
                  className="cursor-pointer px-4 py-2"
                >
                  Create {inputValue}
                </div>
              )}

              {isOpen &&
                items.map((item, index) => (
                  <div
                    key={`${item.id}${index}`}
                    className={cn('rounded-lg cursor-pointer px-4 py-2', {
                      'bg-accent text-accent-foreground':
                        highlightedIndex === index,
                    })}
                    {...getItemProps({ item, index })}
                  >
                    {item.label}
                  </div>
                ))}

              {items?.length === 0 && (
                <div className="cursor-not-allowed px-4 py-3 text-center">
                  <div aria-label="Loading" className="text-muted-foreground">
                    No results
                  </div>
                </div>
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    )
  },
)
