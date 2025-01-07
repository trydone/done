import {observer} from 'mobx-react-lite'
import {useContext, useState} from 'react'

import {RootStoreContext} from '@/lib/stores/root-store'

import {ChecklistButton} from './checklist-button'
import {ChecklistList} from './checklist-list'
import {TagButton} from './tag-button'
import {TagDialog} from './tag-dialog'
import {TagList} from './tag-list'
import {TaskHeader} from './task-header'
import {TaskNotes} from './task-notes'
import {Task} from './types'
import {WhenButton} from './when-button'
import {WhenDialog} from './when-dialog'
import {WhenLabel} from './when-label'

type Props = {
  task: Task
  checked: boolean
  onComplete: (checked: boolean) => void
  showDashedCheckbox?: boolean
}

export const TaskItemDetails = observer(
  ({task, checked, onComplete, showDashedCheckbox}: Props) => {
    const {
      localStore: {tempTask},
    } = useContext(RootStoreContext)
    const [tagOpen, setTagOpen] = useState(false)
    const [whenOpen, setWhenOpen] = useState(false)

    const newTask = tempTask || task

    return (
      <div className="task-outside-click py-5">
        <div className="flex h-full flex-col rounded-lg bg-background shadow-md">
          <TaskHeader
            task={task}
            checked={checked}
            onComplete={onComplete}
            showDashedCheckbox={showDashedCheckbox}
          />

          <TaskNotes task={task} />

          {(task?.checklistItems || []).length > 0 && (
            <ChecklistList task={task} />
          )}

          {(task?.tags || []).length > 0 && (
            <TagList task={task} setOpen={setTagOpen} />
          )}

          <div className="flex items-center gap-1 pb-4 pl-9 pr-3">
            <div className="flex-1">
              {newTask?.start !== 'not_started' && (
                <WhenLabel task={newTask} setOpen={setWhenOpen} />
              )}
            </div>

            {(task?.tags || []).length === 0 && (
              <TagButton task={task} setOpen={setTagOpen} />
            )}

            {(task?.checklistItems || []).length === 0 && (
              <ChecklistButton task={task} />
            )}

            {newTask?.start === 'not_started' && (
              <WhenButton task={newTask} setOpen={setWhenOpen} />
            )}
          </div>
        </div>

        {tagOpen && (
          <TagDialog task={task} open={tagOpen} setOpen={setTagOpen} />
        )}

        {whenOpen && (
          <WhenDialog
            type="single"
            task={newTask}
            open={whenOpen}
            setOpen={setWhenOpen}
          />
        )}
      </div>
    )
  },
)
