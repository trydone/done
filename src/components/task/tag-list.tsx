import { TagRow, TaskRow } from '@/schema'

import { Badge } from '../ui/badge'

type Props = {
  task: TaskRow & { tags: readonly TagRow[] }
  setOpen: (open: boolean) => void
}

export const TagList = ({ task, setOpen }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pb-3 pl-10 pr-3 pt-4">
      {(task?.tags || []).map((tag) => (
        <Badge
          variant="blue"
          key={tag.id}
          onClick={() => setOpen(true)}
          className="rounded-full"
        >
          <span>{tag.title}</span>
        </Badge>
      ))}
    </div>
  )
}
