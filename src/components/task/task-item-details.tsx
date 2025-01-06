import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { ChecklistItemRow, TagRow, TaskRow } from '@/schema'

import { ChecklistButton } from './checklist-button'
import { ChecklistList } from './checklist-list'
import { TagButton } from './tag-button'
import { TagDialog } from './tag-dialog'
import { TagList } from './tag-list'
import { TaskHeader } from './task-header'
import { TaskNotes } from './task-notes'
import { WhenButton } from './when-button'
import { WhenDialog } from './when-dialog'
import { WhenLabel } from './when-label'

type Props = {
  task: TaskRow & {
    checklistItems: readonly ChecklistItemRow[]
    tags: readonly TagRow[]
  }
  checked: boolean
  onComplete: (checked: boolean) => void
}

export const TaskItemDetails = observer(
  ({ task, checked, onComplete }: Props) => {
    const [tagOpen, setTagOpen] = useState(false)
    const [whenOpen, setWhenOpen] = useState(false)

    return (
      <>
        <div className="flex h-full flex-col rounded-lg bg-background shadow-md">
          <TaskHeader task={task} checked={checked} onComplete={onComplete} />

          <TaskNotes task={task} />

          {(task?.checklistItems || []).length > 0 && (
            <ChecklistList task={task} />
          )}

          {(task?.tags || []).length > 0 && (
            <TagList task={task} setOpen={setTagOpen} />
          )}

          <div className="flex items-center pb-4 pl-10 pr-3">
            <div className="flex-1">
              {task?.start !== 'not_started' && (
                <WhenLabel task={task} setOpen={setWhenOpen} />
              )}
            </div>

            {(task?.tags || []).length === 0 && (
              <TagButton task={task} setOpen={setTagOpen} />
            )}

            {(task?.checklistItems || []).length === 0 && (
              <ChecklistButton task={task} />
            )}

            {task?.start === 'not_started' && (
              <WhenButton task={task} setOpen={setWhenOpen} />
            )}
          </div>
        </div>

        {tagOpen && (
          <TagDialog task={task} open={tagOpen} setOpen={setTagOpen} />
        )}

        {whenOpen && (
          <WhenDialog
            type="single"
            task={task}
            open={whenOpen}
            setOpen={setWhenOpen}
          />
        )}
      </>
    )
  },
)
