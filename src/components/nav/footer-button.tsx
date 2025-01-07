import {LucideIcon} from 'lucide-react'
import {ComponentProps} from 'react'

import {Button} from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {ButtonState} from '@/lib/stores/local-store'
import {cn} from '@/lib/utils'

type FooterButtonProps = {
  icon: LucideIcon
  title: string
  state?: ButtonState
} & Omit<ComponentProps<typeof Button>, 'children' | 'disabled'>

export const FooterButton = ({
  icon: Icon,
  title,
  state = 'visible',
  className = '',
  ...props
}: FooterButtonProps) => {
  if (state === 'hidden') {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={state === 'disabled'}
            className={cn(
              'h-8 w-full p-0',
              'border border-transparent !bg-transparent hover:border-border focus:border-border',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'rounded-md transition-colors',
              className,
            )}
            {...props}
          >
            <Icon
              className={cn('h-4 w-4 text-foreground', {
                'opacity-60': state === 'disabled',
              })}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="px-2 py-1 text-xs">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
