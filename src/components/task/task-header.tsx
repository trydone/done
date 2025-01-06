import {useCallback} from 'react'

import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {useZero} from '@/hooks/use-zero'
import {cn} from '@/lib/utils'
import {TaskRow} from '@/schema'

type Props = {
  task: TaskRow
  checked: boolean
  onComplete: (checked: boolean) => void
  showDashedCheckbox?: boolean
}

export const TaskHeader = ({
  task,
  checked,
  onComplete,
  showDashedCheckbox,
}: Props) => {
  const zero = useZero()

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      zero.mutate.task.update({
        id: task.id,
        title: e.target.value,
      })
    },
    [task.id, zero.mutate.task],
  )

  return (
    <div className="flex gap-2 px-4">
      <div className="pb-1 pt-4">
        <div className="flex h-[20px] w-4 items-center">
          <Checkbox
            id={`task-${task.id}-status`}
            checked={checked}
            onCheckedChange={onComplete}
            className={cn('shrink-0', {
              'ft-checkbox-dashed': showDashedCheckbox,
            })}
          />
        </div>
      </div>

      <Input
        id={`task-${task.id}-title`}
        value={task.title}
        onChange={handleTitleChange}
        placeholder="New To-Do"
        className="h-auto !rounded-none border-none bg-transparent p-0 pb-1 pt-4 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
        autoFocus
      />
    </div>
  )
}
