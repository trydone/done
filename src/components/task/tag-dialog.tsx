import {useState} from 'react'

import {Dialog, DialogContent} from '@/components/ui/dialog'
import {TagRow} from '@/schema'

import {TagDialogForm} from './tag-dialog-form'
import {TagDialogList} from './tag-dialog-list'
import {TagDialogManage} from './tag-dialog-manage'
import {Task} from './types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  task: Task
}

type View = 'list' | 'form' | 'manage'

export const TagDialog = ({open, setOpen, task}: Props) => {
  const [view, setView] = useState<View>('list')
  const [editingTag, setEditingTag] = useState<TagRow | null>(null)

  const handleClose = () => {
    setView('list')
    setEditingTag(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {view === 'list' && (
          <TagDialogList
            task={task}
            onNewTag={() => setView('form')}
            onManageTags={() => setView('manage')}
            onClose={handleClose}
          />
        )}

        {view === 'form' && (
          <TagDialogForm
            task={task}
            tag={editingTag || undefined}
            onSuccess={() => {
              setEditingTag(null)
              setView(editingTag ? 'manage' : 'list')
            }}
            onCancel={() => {
              setEditingTag(null)
              setView(editingTag ? 'manage' : 'list')
            }}
          />
        )}

        {view === 'manage' && (
          <TagDialogManage
            task={task}
            onEditTag={(tag) => {
              setEditingTag(tag)
              setView('form')
            }}
            onCancel={() => {
              setEditingTag(null)
              setView('list')
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
