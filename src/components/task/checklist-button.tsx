import { FlagIcon } from 'lucide-react'
import { useCallback } from 'react'
import { v4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { useZero } from '@/hooks/use-zero'
import { ChecklistItemRow, TaskRow } from '@/schema'

type Props = {
  task: TaskRow & { checklistItems: readonly ChecklistItemRow[] }
}

export const ChecklistButton = ({ task }: Props) => {
  const zero = useZero()

  const handleAddItem = useCallback(() => {
    zero.mutate.checklist_item.insert({
      id: v4(),
      task_id: task.id,
      title: '',
      completed_at: null,
      sort_order: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
  }, [task.id, zero.mutate.checklist_item])

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={handleAddItem}
    >
      <FlagIcon className="size-4" />
    </Button>
  )
}
