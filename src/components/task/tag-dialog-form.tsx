import { useQuery } from '@rocicorp/zero/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { v4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useZero } from '@/hooks/use-zero'
import { TagRow } from '@/schema'

import { DialogTitle } from '../ui/dialog'
import { Task } from './types'

type Props = {
  task: Task
  tag?: TagRow
  onSuccess: () => void
  onCancel: () => void
}

export const TagDialogForm = ({ task, tag, onSuccess, onCancel }: Props) => {
  const [title, setTitle] = useState(tag?.title || '')
  const zero = useZero()
  const [availableTags] = useQuery(zero.query.tag)
  const isEditing = !!tag

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const existingTag = availableTags?.find(
      (t) =>
        t.title.toLowerCase() === title.toLowerCase() &&
        (!isEditing || t.id !== tag.id),
    )

    if (existingTag) {
      toast.error('Tag Already Exists', {
        description: `A tag with title of "${title}" already exists. Please choose a different title.`,
      })
      return
    }

    if (isEditing) {
      await zero.mutate.tag.update({
        id: tag.id,
        title: title.trim(),
        updated_at: Date.now(),
      })
    } else {
      const newTag = {
        id: v4(),
        title: title.trim(),
        workspace_id: task.workspace_id,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      await zero.mutate.tag.insert(newTag)
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <DialogTitle>{isEditing ? 'Edit Tag' : 'New Tag'}</DialogTitle>
        <Button variant="ghost" type="submit" disabled={!title.trim()}>
          Save
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Tag"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>
    </form>
  )
}
