import {TagIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'

import {Task} from './types'

type Props = {
  task: Task
  setOpen: (open: boolean) => void
}

export const TagButton = ({setOpen}: Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={() => setOpen(true)}
    >
      <TagIcon className="size-4" />
    </Button>
  )
}
