import React, { ReactNode, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useController } from "react-hook-form";

import { FormControl } from "@/components/ui/form-control";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useErrorState } from "@/hooks/use-error-state";

interface Props extends InputProps {
  name: string;
  label?: ReactNode;
  caption?: ReactNode;
  control: any;
  onChange: (value: any) => void;
  clearable?: boolean;
  className?: string;
  inputClassName?: string;
  onClose?: () => void;
}

export const ColorField = ({
  label,
  name,
  control,
  caption,
  onChange,
  placeholder = "E.g. #F0F0FA",
  className,
  inputClassName,
  onClose,
  ...rest
}: Props) => {
  const [open, setOpen] = useState(false);
  const { field, fieldState } = useController({ control, name });
  const hasError = useErrorState(fieldState, control);

  return (
    <FormControl
      label={label}
      caption={caption}
      error={hasError ? fieldState.error?.message : null}
      name={name}
      className={className}
    >
      <label htmlFor="name" className="input-group relative">
        <span className="!px-2 py-1">
          <Popover
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
              if (open) {
                return;
              }

              onClose?.();
            }}
          >
            <PopoverTrigger asChild>
              <button
                className="size-7 border border-border"
                style={{ backgroundColor: field.value }}
              />
            </PopoverTrigger>

            <PopoverContent>
              <HexColorPicker
                color={field.value}
                onChange={(value) => onChange(value.toUpperCase())}
              />
            </PopoverContent>
          </Popover>
        </span>

        <Input
          {...field}
          {...rest}
          id={name}
          hasError={hasError}
          placeholder={placeholder}
          onClear={() => onChange("")}
          className={inputClassName}
        />
      </label>
    </FormControl>
  );
};
