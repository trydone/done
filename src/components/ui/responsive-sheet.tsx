import { useBreakpoint } from '@/lib/hooks/use-breakpoint'

import { Dialog } from './dialog'
import { Sheet } from './sheet'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  modal?: boolean
  defaultOpen?: boolean
}

export const ResponsiveSheet = ({
  open,
  onOpenChange,
  children,
  modal,
  defaultOpen,
}: Props) => {
  const breakpoint = useBreakpoint()
  const isDesktop = ['lg', 'xl'].includes(breakpoint)

  if (!isDesktop) {
    return (
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
        modal={modal}
        defaultOpen={defaultOpen}
      >
        {children}
      </Sheet>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      defaultOpen={defaultOpen}
    >
      {children}
    </Dialog>
  )
}
