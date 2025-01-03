import React, { ReactNode, useRef } from "react";
import { useController } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDimensions } from "@/hooks/use-dimensions";
import { useErrorState } from "@/hooks/use-error-state";

type SelectOption = {
  id: string | number;
  label: string | ReactNode;
  description?: string;
  caption?: string;
};

type Props = {
  name: string;
  label?: ReactNode;
  caption?: ReactNode;
  control: any;
  placeholder?: ReactNode;
  className?: string;
  options: SelectOption[];
  maxDropdownHeight?: number;
  onValueChange?: (value: string | number) => void;
  clearable?: boolean;
  isInt?: boolean;
  disabled?: boolean;
};

export const SelectField = ({
  name,
  label,
  caption,
  options,
  placeholder = "Please select an option",
  control,
  className,
  maxDropdownHeight = 250,
  onValueChange,
  clearable,
  isInt,
  ...props
}: Props) => {
  const { field, fieldState } = useController({ name, control });
  const hasError = useErrorState(fieldState, control);
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(ref);

  return (
    <div ref={ref}>
      <FormControl
        label={label}
        caption={caption}
        error={hasError ? fieldState.error?.message : null}
        name={name}
        className={className}
      >
        <Select
          {...field}
          {...props}
          value={isInt ? String(field.value) : field.value}
          defaultValue={isInt ? String(field.value) : field.value}
          // error={hasError}
          onValueChange={(value) => {
            field.onBlur();
            field.onChange(isInt ? parseInt(value) : value);
            onValueChange?.(isInt ? parseInt(value) : value);
          }}
        >
          <SelectTrigger>
            {options.find((option) => option.id === field.value)?.label ||
              placeholder}
          </SelectTrigger>

          <SelectContent style={{ maxHeight: maxDropdownHeight }}>
            <SelectGroup>
              {options.map((option, index) => {
                return (
                  <SelectItem
                    id={String(option.id)}
                    key={index}
                    value={String(option.id)}
                    style={{ maxWidth: width }}
                  >
                    {option.label && (
                      <div className="mb-1 text-wrap">{option.label}</div>
                    )}
                    {option.description && (
                      <div className="mb-1 text-wrap text-sm">
                        {option.description}
                      </div>
                    )}
                    {option.caption && (
                      <div className="text-wrap text-sm opacity-60">
                        {option.caption}
                      </div>
                    )}
                  </SelectItem>
                );
              })}
            </SelectGroup>

            {clearable && (
              <div>
                <Button
                  className="px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onBlur();
                    field.onChange("");
                    onValueChange?.("");
                  }}
                  type="button"
                >
                  Clear
                </Button>
              </div>
            )}
          </SelectContent>
        </Select>
      </FormControl>
    </div>
  );
};
