'use client'

import {useQuery} from '@rocicorp/zero/react'
import {Pencil, User} from 'lucide-react'
import {observer} from 'mobx-react-lite'
import Link from 'next/link'
import {FC, ReactNode, useContext} from 'react'

import {H2} from '@/components/shared/typography'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {useZero} from '@/hooks/use-zero'
import {RootStoreContext} from '@/lib/stores/root-store'
import {UserRow, WorkspaceMemberRow, WorkspaceRow} from '@/schema'

import {Button} from '../ui/button'
import {WorkspaceSignout} from './workspace-signout'

type ExtendedWorkspaceMemberRow = WorkspaceMemberRow & {
  workspace: readonly WorkspaceRow[]
}

type ExtendedUserRow = UserRow & {
  workspaceMembers: readonly ExtendedWorkspaceMemberRow[]
}

interface Compound
  extends FC<{
    users?: readonly ExtendedUserRow[]
    selectedUserId?: string
    selectedWorkspaceId?: string
    onWorkspaceChange: (params: {userId: string; workspaceId: string}) => void
    onAllWorkspacesClick?: () => void
    renderUserTitle?: (user: ExtendedUserRow) => ReactNode
  }> {
  AllWorkspaces: FC<{
    active: boolean
    onClick?: () => void
  }>
  Block: FC
}

export const WorkspaceSwitch: Compound = ({
  users,
  selectedUserId,
  selectedWorkspaceId,
  onWorkspaceChange,
  onAllWorkspacesClick,
  renderUserTitle,
}) => (
  <div className="flex flex-col gap-2 p-2">
    <AllWorkspaces
      active={selectedUserId === undefined && selectedWorkspaceId === undefined}
      onClick={onAllWorkspacesClick}
    />
    {users?.map((user) => (
      <div key={user.id} className="flex flex-col gap-2">
        {renderUserTitle ? renderUserTitle(user) : <H2>{user.username}</H2>}

        <RadioGroup
          value={selectedUserId === user.id ? selectedWorkspaceId : ``}
          onValueChange={(value) =>
            onWorkspaceChange({
              userId: user.id,
              workspaceId: value,
            })
          }
        >
          {user.workspaceMembers.map((workspaceMember) => (
            <div
              key={workspaceMember.workspace_id}
              className="group/wmember flex items-center space-x-2 pl-2"
            >
              <RadioGroupItem
                value={workspaceMember.workspace_id}
                id={workspaceMember.workspace_id}
              />
              <Label className="flex-1" htmlFor={workspaceMember.workspace_id}>
                {workspaceMember.workspace[0]?.name}
              </Label>
              <Link href={`/workspace/general`}>
                <Button
                  className="invisible -my-2 group-hover/wmember:visible"
                  variant="ghost"
                  size="xs"
                >
                  <Pencil size={12} />
                </Button>
              </Link>
            </div>
          ))}
        </RadioGroup>
      </div>
    ))}
  </div>
)

const AllWorkspaces: Compound['AllWorkspaces'] = ({active, onClick}) => (
  <RadioGroup value={active ? `all` : ``} onValueChange={onClick}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="all" id="all" />
      <Label htmlFor="all">All Workspaces</Label>
    </div>
  </RadioGroup>
)

WorkspaceSwitch.AllWorkspaces = AllWorkspaces

const Block: Compound['Block'] = observer(() => {
  const zero = useZero()

  const [users] = useQuery(
    zero.query.user.related('workspaceMembers', (q) => q.related('workspace')),
  )

  const {
    localStore: {
      changeWorkspace,
      clearWorkspace,
      selectedWorkspaceId,
      selectedUserId,
    },
  } = useContext(RootStoreContext)

  return (
    <WorkspaceSwitch
      selectedWorkspaceId={selectedWorkspaceId}
      selectedUserId={selectedUserId}
      users={users}
      onWorkspaceChange={changeWorkspace}
      onAllWorkspacesClick={clearWorkspace}
      renderUserTitle={(user) => (
        <div className="group/workspace flex flex-row gap-2">
          <div className="flex flex-1 items-center gap-2 font-semibold">
            <User className="size-4" />
            {user.email}
          </div>
          <div className="invisible group-hover/workspace:visible">
            <WorkspaceSignout.Block userId={user.id} />
          </div>
        </div>
      )}
    />
  )
})

WorkspaceSwitch.Block = Block
