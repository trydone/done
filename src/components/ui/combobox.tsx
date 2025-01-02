import { ChevronDownIcon } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useCombobox, UseComboboxStateChange } from "downshift";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";

import { cn } from "@/lib/utils/cn";

import { Input, InputProps } from "./input";

export type ComboboxOption = {
  id?: string | number;
  label?: string;
  description?: string; // Added description field
};

export type OnChangeParams =
  | ((changes: UseComboboxStateChange<ComboboxOption>) => void)
  | undefined;

export interface ComboboxProps extends Omit<InputProps, "value" | "onChange"> {
  options: ComboboxOption[] | undefined;
  value?: ComboboxOption | undefined;
  onChange?: OnChangeParams;
  onInputChange?: OnChangeParams;
  isLoading?: boolean;
  startOpen?: boolean;
  leftIcon?: ReactNode;
  clearable?: boolean;
  children?: ReactNode;
  noResults?: ReactNode;
  clearInputValue?: () => void;
  ref?: any;
}

export type ComboboxRef = {
  clearInput: () => void;
  closeMenu: () => void;
  selectItem: (option: ComboboxOption) => void;
  inputValue: string;
};

export const Combobox: React.FC<ComboboxProps> = forwardRef(
  (
    {
      options,
      value,
      onChange,
      onInputChange,
      startOpen = false,
      onClear,
      leftIcon,
      clearable = false,
      noResults,
      children,
      ...inputProps
    },
    ref,
  ) => {
    const {
      isOpen,
      getInputProps,
      getMenuProps,
      highlightedIndex,
      getItemProps,
      selectItem,
      inputValue,
      setInputValue,
      closeMenu,
    } = useCombobox({
      items: options || [],
      itemToString: (item: ComboboxOption | null) => item?.label || "",
      initialSelectedItem: value,
      onInputValueChange: onInputChange,
      onSelectedItemChange: onChange,
      initialIsOpen: startOpen,
      defaultHighlightedIndex: 0,
    });

    const comboboxRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);

    const clearInput = useCallback(() => {
      setInputValue("");
      if (onClear) {
        onClear();
      }
    }, [onClear, setInputValue]);

    useImperativeHandle(
      ref,
      () =>
        ({
          clearInput,
          closeMenu,
          selectItem,
          inputValue,
        }) as ComboboxRef,
      [clearInput, closeMenu, inputValue, selectItem],
    );

    return (
      <>
        <PopoverPrimitive.Root defaultOpen={startOpen} open={isOpen}>
          <PopoverPrimitive.Anchor asChild>
            <div className="relative w-full">
              <Input
                className={cn({
                  "pl-10": !!leftIcon,
                })}
                onClear={() => {
                  selectItem({});
                  onClear?.();
                }}
                clearable={clearable}
                {...getInputProps({}, { suppressRefError: true })}
                {...inputProps}
                ref={comboboxRef}
              />
              <div className="absolute right-3 top-4">
                {((clearable && inputValue.length === 0) || !clearable) && (
                  <ChevronDownIcon width={20} height={20} />
                )}
              </div>

              <div className="absolute left-3 top-4">{leftIcon}</div>
            </div>
          </PopoverPrimitive.Anchor>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              className="popover-content relative z-[110] max-h-[250px] min-w-32 translate-y-1 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-soft animate-in fade-in-80"
              asChild
              onOpenAutoFocus={(event) => event.preventDefault()}
              onInteractOutside={(event) => {
                const target = event.target as Element | null;
                const isCombobox = target === comboboxRef.current;
                const inListbox =
                  target && listboxRef.current?.contains(target);
                if (isCombobox || inListbox) {
                  event.preventDefault();
                }
              }}
            >
              <div
                className="w-full overflow-y-auto p-1"
                {...getMenuProps({}, { suppressRefError: true })}
              >
                {children}

                {(options || []).map((item, index) => {
                  const escapeRegExp = (string: string) => {
                    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                  };

                  const labelParts = item.label?.split(
                    new RegExp(`(${escapeRegExp(inputValue)})`, "gi"),
                  );

                  return (
                    <div
                      key={`${item.id}${index}`}
                      className={cn("rounded-lg cursor-pointer px-4 py-2", {
                        "bg-accent text-accent-foreground":
                          highlightedIndex === index,
                      })}
                      {...getItemProps({
                        item,
                        index,
                      })}
                    >
                      <div>
                        {labelParts?.map((part, i) =>
                          part.toLowerCase() === inputValue.toLowerCase() ? (
                            <strong key={i}>{part}</strong>
                          ) : (
                            <span key={i}>{part}</span>
                          ),
                        )}
                      </div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                    </div>
                  );
                })}

                {(options || []).length === 0 &&
                  (noResults ? (
                    noResults
                  ) : (
                    <div className="cursor-not-allowed px-4 py-3 text-center">
                      <div
                        aria-label="Loading"
                        className="text-muted-foreground"
                      >
                        No results
                      </div>
                    </div>
                  ))}
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </>
    );
  },
);
