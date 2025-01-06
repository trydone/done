import {CalendarIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {TaskRow} from '@/schema'

type Props = {
  task: TaskRow
  setOpen: (open: boolean) => void
}

export const WhenButton = ({setOpen}: Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={() => setOpen(true)}
    >
      <CalendarIcon className="size-4" />
    </Button>
  )
}
