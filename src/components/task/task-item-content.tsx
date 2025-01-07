import {format} from 'date-fns'
import {MoonIcon, StarIcon} from 'lucide-react'

import {Checkbox} from '@/components/ui/checkbox'
import {cn} from '@/lib/utils'

import {TaskMetadata} from './task-metadata'
import {Task} from './types'

type Props = {
  task: Task
  checked: boolean
  onComplete?: (checked: boolean) => void
  showWhenIcon?: boolean
  showDashedCheckbox?: boolean
}

export const TaskItemContent = ({
  task,
  onComplete,
  checked,
  showWhenIcon,
  showDashedCheckbox,
}: Props) => {
  const formatCompletedDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
    return format(date, 'd MMM') // Format as "4 Jan"
  }

  return (
    <>
      <div className="flex h-[20px] w-4 items-center">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => onComplete?.(checked as boolean)}
          className={cn('shrink-0', {'ft-checkbox-dashed': showDashedCheckbox})}
        />
      </div>

      <div className="flex min-w-0 grow">
        <div className="flex items-center gap-2">
          {task.completed_at && (
            <span className="text-xs font-bold text-blue-600 dark:text-blue-500">
              {formatCompletedDate(task.completed_at)}
            </span>
          )}

          {showWhenIcon &&
            task.start === 'started' &&
            task.start_bucket === 'today' &&
            !!task.start_date && <StarIcon className="size-4" />}

          {showWhenIcon &&
            task.start === 'started' &&
            task.start_bucket === 'evening' &&
            !!task.start_date && <MoonIcon className="size-4" />}

          <span
            className={cn('truncate text-sm', {
              'text-muted-foreground': !task?.title,
            })}
          >
            {task?.title || 'New To-Do'}
          </span>
        </div>

        <TaskMetadata task={task} />
      </div>
    </>
  )
}
