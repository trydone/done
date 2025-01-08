'use client'

import {useQuery} from '@rocicorp/zero/react'
import {observer} from 'mobx-react-lite'
import {useContext, useEffect} from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {useZero} from '@/hooks/use-zero'
import {RootStoreContext} from '@/lib/stores/root-store'
import {WorkspaceRow} from '@/schema'

type ExtendedWorkspaceRow = WorkspaceRow

type Compound = typeof View & {
  useBlock: typeof useBlock
  Block: typeof Block
}

export const View = observer(
  ({
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
      <SelectTrigger className="h-8 w-full text-sm">
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
            <WorkspaceItem
              name={workspace.name}
              slug={workspace.slug}
              showSlug={false}
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
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
    <span className="max-w-[160px] truncate text-sm">{name}</span>
    {showSlug && (
      <span className="ml-2 text-xs text-muted-foreground">
        {`trydone.io/${slug}`}
      </span>
    )}
  </div>
)

const useBlock = () => {
  const zero = useZero()
  const {
    localStore: {selectedWorkspaceId, changeWorkspace},
  } = useContext(RootStoreContext)

  const [workspaces] = useQuery(zero.query.workspace)

  const selectedWorkspace = workspaces?.find(
    (workspace) => workspace.id === selectedWorkspaceId,
  )

  useEffect(() => {
    if (!selectedWorkspace && workspaces?.[0]?.id) {
      changeWorkspace({
        workspaceId: workspaces[0].id,
        userId: undefined,
      })
    }
  }, [workspaces, selectedWorkspace, changeWorkspace])

  return {
    workspaces: workspaces || [],
    selectedWorkspace,
    selectedWorkspaceId,
    changeWorkspace: (workspaceId: string) => {
      changeWorkspace({workspaceId, userId: undefined})
    },
  }
}

const Block = observer(() => {
  const fromWorkspaceSelect = useBlock()
  return <WorkspaceSelect {...fromWorkspaceSelect} />
})

// @ts-expect-error compound
export const WorkspaceSelect: Compound = View
WorkspaceSelect.useBlock = useBlock
WorkspaceSelect.Block = Block
