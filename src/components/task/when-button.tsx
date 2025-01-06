import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TagRow, TaskRow } from '@/schema'

type Props = {
  task: TaskRow & { tags: readonly TagRow[] }
  setOpen: (open: boolean) => void
}

export const WhenButton = ({ setOpen }: Props) => {
  return (
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
      <CalendarIcon className="size-4" />
    </Button>
  )
}
