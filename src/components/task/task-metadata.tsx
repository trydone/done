import { differenceInDays, format } from 'date-fns'
import { ClockIcon, FileIcon, ListIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ChecklistItemRow, TagRow, TaskRow } from '@/schema'

import { Badge } from '../ui/badge'

type Props = {
  task: TaskRow & {
    tags: readonly TagRow[]
    checklistItems: readonly ChecklistItemRow[]
  }
  className?: string
}

export const TaskMetadata = ({ task, className }: Props) => {
  const getDaysLeft = (deadline_at: Date) => {
    const days = differenceInDays(deadline_at, new Date())
    return `${days} days left`
  }

  const hasLeftMetadata =
    (task?.tags || []).length > 0 ||
    (task?.checklistItems || []).length > 0 ||
    task.reminder_at ||
    task.description

  if (!hasLeftMetadata && !task.deadline_at) {
    return null
  }

  return (
    <div className={cn('flex items-center justify-between px-3', className)}>
      {/* Left side metadata */}
      <div className="flex items-center gap-2">
        {task.reminder_at && (
          <div className="flex items-center gap-1">
            <ClockIcon className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {format(task.reminder_at, 'h:mm a')}
            </span>
          </div>
        )}

        {task.description && (
          <div className="flex items-center gap-1">
            <FileIcon className="size-3 text-muted-foreground" />
          </div>
        )}

        {(task?.checklistItems || []).length > 0 && (
          <div className="flex items-center gap-1">
            <ListIcon className="size-3 text-muted-foreground" />
          </div>
        )}

        {(task?.tags || []).map((tag, index) => (
          <Badge
            variant="default"
            className="flex items-center gap-1 text-xs"
            key={index}
          >
            {tag.title}
          </Badge>
        ))}
      </div>

      {/* Right side with deadline */}
      {task.deadline_at && (
        <div className="flex items-center">
          <span className="text-xs font-medium text-muted-foreground">
            {getDaysLeft(new Date(task.deadline_at))}
          </span>
        </div>
      )}
    </div>
  )
}
