'use client'

import {useQuery} from '@rocicorp/zero/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useZero} from '@/hooks/use-zero'
import {WorkspaceRow} from '@/schema'

type Compound = typeof View & {
  Block: typeof Block
  useWorkspaceSettings: typeof useBlock
}

// TODO: NextJS borken compound components https://github.com/vercel/next.js/issues/74585
const View = ({
  workspace,
  onNameChange,
}: {
  workspace?: WorkspaceRow
  onNameChange: (name: string) => void
}) => {
  return (
    <div className="container mx-auto max-w-3xl space-y-8 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Information</CardTitle>
          <CardDescription>
            Update your workspace details and customize your experience.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              defaultValue={workspace?.name || ``}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Done"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const useBlock = (workspaceId: string) => {
  const zero = useZero()
  const [workspace] = useQuery(
    zero.query.workspace.where('id', '=', workspaceId).one(),
  )

  const onNameChange = async (name: string) => {
    await zero.mutate.workspace.update({
      id: workspaceId,
      name,
    })
  }

  return {
    workspace,
    onNameChange,
  }
}

const Block = ({workspaceId}: {workspaceId: string}) => {
  const fromWorkspaceInfo = useBlock(workspaceId)
  return <WorkspaceInfoEditor {...fromWorkspaceInfo} />
}

// @ts-expect-error compound
export const WorkspaceInfoEditor: Compound = View
WorkspaceInfoEditor.useWorkspaceSettings = useBlock
WorkspaceInfoEditor.Block = Block
