import {
  ArrowBigUpIcon,
  ArrowDownIcon,
  ArrowRightToLineIcon,
  ArrowUpIcon,
  CommandIcon,
  CornerDownLeft,
  Delete,
} from 'lucide-react'
import * as React from 'react'

import {cn} from '@/lib/utils'

type KbdIcon =
  | 'mod'
  | 'shift'
  | 'enter'
  | 'command'
  | 'ctrl'
  | 'alt'
  | 'tab'
  | 'backspace'
  | 'up'
  | 'down'

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  icon?: KbdIcon
}

const iconMap: Record<KbdIcon, React.ReactNode> = {
  mod: <CommandIcon className="size-3" />,
  shift: <ArrowBigUpIcon className="size-3" />,
  enter: <CornerDownLeft className="size-3" />,
  command: <CommandIcon className="size-3" />,
  ctrl: 'Ctrl',
  alt: 'Alt',
  tab: <ArrowRightToLineIcon className="size-3" />,
  backspace: <Delete className="size-3" />,
  up: <ArrowUpIcon className="size-3" />,
  down: <ArrowDownIcon className="size-3" />,
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({className, children, icon, ...props}, ref) => {
    const content = icon ? iconMap[icon] : children

    return (
      <kbd
        ref={ref}
        className={cn(
          'pointer-events-none flex size-5 select-none items-center justify-center gap-1 rounded border bg-muted font-mono text-[10px] font-medium',
          className,
        )}
        {...props}
      >
        {content}
      </kbd>
    )
  },
)
Kbd.displayName = 'Kbd'

export {Kbd}
