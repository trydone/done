import {ChecklistItemRow, TagRow, TaskRow} from '@/schema'

export type Task = TaskRow & {
  tags: readonly TagRow[]
  checklistItems: readonly ChecklistItemRow[]
}
