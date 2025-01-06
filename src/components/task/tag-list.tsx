import { Badge } from '../ui/badge'
import { Task } from './types'

type Props = {
  task: Task
  setOpen: (open: boolean) => void
}

export const TagList = ({ task, setOpen }: Props) => {
  return (
    <div
      onClick={() => setOpen(true)}
      className="flex cursor-pointer flex-wrap items-center gap-1 pb-3 pl-10 pr-3 pt-4"
    >
      {(task?.tags || []).map((tag) => (
        <Badge variant="blue" key={tag.id} className="rounded-full text-xs">
          <span>{tag.title}</span>
        </Badge>
      ))}
    </div>
  )
}
