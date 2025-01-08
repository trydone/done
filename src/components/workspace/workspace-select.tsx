'use client'

import {useQuery} from '@rocicorp/zero/react'
import {useEffect, useState} from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {useZero} from '@/hooks/use-zero'
import {WorkspaceRow} from '@/schema'

type ExtendedWorkspaceRow = WorkspaceRow

type Compound = typeof View & {
  useBlock: typeof useBlock
  Block: typeof Block
}

export const View = ({
  workspaces,
  selectedWorkspace,
  selectedWorkspaceId,
  changeWorkspace,
}: {
  workspaces: readonly ExtendedWorkspaceRow[]
  selectedWorkspace?: ExtendedWorkspaceRow
  selectedWorkspaceId?: string
  changeWorkspace: (workspaceId: string) => void
}) => (
  <Select value={selectedWorkspaceId} onValueChange={changeWorkspace}>
    <SelectTrigger className="w-[280px]">
      <SelectValue placeholder="Select workspace">
        {selectedWorkspace && (
          <WorkspaceItem
            name={selectedWorkspace.name}
            slug={selectedWorkspace.slug}
            showSlug={false}
          />
        )}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {workspaces.map((workspace) => (
        <SelectItem key={workspace.id} value={workspace.id}>
          <WorkspaceItem name={workspace.name} slug={workspace.slug} showSlug />
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const WorkspaceItem = ({
  name,
  slug,
  showSlug,
}: {
  name: string
  slug: string
  showSlug: boolean
}) => (
  <div className="flex items-center gap-2">
    <span className="max-w-[160px] truncate">{name}</span>
    {showSlug && (
      <span className="ml-2 text-xs text-muted-foreground">
        {`trydone.io/${slug}`}
      </span>
    )}
  </div>
)

const useBlock = () => {
  const zero = useZero()

  const [workspaces] = useQuery(
    zero.query.workspace.related('sessionMembers', (q) => q.one()),
  )

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<
    string | undefined
  >()

  const selectedWorkspace = workspaces?.find(
    (workspace) => workspace.id === selectedWorkspaceId,
  )

  useEffect(() => {
    if (!selectedWorkspace && workspaces?.[0]?.id) {
      setSelectedWorkspaceId(workspaces[0].id)
    }
  }, [workspaces, selectedWorkspace])

  const changeWorkspace = async (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId)
  }

  return {
    workspaces: workspaces || [],
    selectedWorkspace,
    selectedWorkspaceId,
    changeWorkspace,
  }
}

const Block = () => {
  const fromWorkspaceSelect = useBlock()
  return <WorkspaceSelect {...fromWorkspaceSelect} />
}

// @ts-expect-error compound
export const WorkspaceSelect: Compound = View
WorkspaceSelect.useBlock = useBlock
WorkspaceSelect.Block = Block
