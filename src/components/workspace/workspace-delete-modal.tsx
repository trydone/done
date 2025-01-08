'use client'

import {useQuery} from '@rocicorp/zero/react'
import {useState} from 'react'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {useZero} from '@/hooks/use-zero'
import {WorkspaceRow} from '@/schema'

type Compound = typeof View & {
  useBlock: typeof useBlock
  Block: typeof Block
}

export const View = ({
  workspace,
  isOpen,
  onClose,
  onDelete,
}: {
  workspace?: WorkspaceRow
  isOpen: boolean
  onClose: () => void
  onDelete: () => Promise<void>
}) => {
  const [confirmName, setConfirmName] = useState('')

  const handleDelete = async () => {
    if (!workspace) return

    if (confirmName !== workspace.name) {
      toast.error('Workspace name does not match')
      return
    }

    try {
      await onDelete()
      onClose()
      toast.success('Workspace deleted successfully')
    } catch {
      toast.error('Failed to delete workspace')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            workspace and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Please type{' '}
            <span className="font-medium text-foreground">
              {workspace?.name}
            </span>{' '}
            to confirm.
          </p>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder="Enter workspace name"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!workspace || confirmName !== workspace.name}
          >
            Delete Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const useBlock = (workspaceId?: string) => {
  const zero = useZero()
  const [isOpen, setIsOpen] = useState(false)
  const [workspace] = useQuery(
    zero.query.workspace.where('id', '=', workspaceId || '').one(),
  )

  const onDelete = async () => {
    if (!workspaceId) return

    await zero.mutate.workspace.delete({
      id: workspaceId,
    })
  }

  return {
    workspace,
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onDelete,
  }
}

const Block = ({workspaceId}: {workspaceId: string}) => {
  const fromWorkspaceDelete = WorkspaceDeleteModal.useBlock(workspaceId)
  return <WorkspaceDeleteModal {...fromWorkspaceDelete} />
}

// @ts-expect-error compound
export const WorkspaceDeleteModal: Compound = View
WorkspaceDeleteModal.useBlock = useBlock
WorkspaceDeleteModal.Block = Block
