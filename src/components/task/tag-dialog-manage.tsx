import { useQuery } from '@rocicorp/zero/react'
import { Pencil, Trash } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePrompt } from '@/hooks/use-prompt'
import { useZero } from '@/hooks/use-zero'
import { TagRow } from '@/schema'

import { DialogTitle } from '../ui/dialog'
import { Task } from './types'

type Props = {
  task: Task
  onEditTag: (tag: TagRow) => void
  onCancel: () => void
}

export const TagDialogManage = ({ onEditTag, onCancel }: Props) => {
  const [search, setSearch] = useState('')
  const zero = useZero()
  const [availableTags] = useQuery(zero.query.tag)
  const dialog = usePrompt()

  const filteredTags = availableTags?.filter((tag) =>
    tag.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (tag: TagRow) => {
    const confirmed = await dialog({
      title: 'Delete Tag',
      description:
        'This tag will be removed from any items that are currently using it. Are you sure you want to delete this tag?',
    })

    if (!confirmed) {
      return
    }

    await zero.mutate.tag.delete({ id: tag.id })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-[52px]" />
        <DialogTitle>Manage Tags</DialogTitle>
        <Button variant="ghost" onClick={onCancel}>
          Done
        </Button>
      </div>

      <Input
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredTags?.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
            >
              <span>{tag.title}</span>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTag(tag)}
                >
                  <Pencil className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(tag)}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
