'use client'

import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {WorkspaceInfoEditor} from '@/components/workspace/workspace-info-editor'
import {WorkspaceSelect} from '@/components/workspace/workspace-select'

export default function Page() {
  const fromWorkspaceSelect = WorkspaceSelect.useBlock()

  const workspaceId = fromWorkspaceSelect.selectedWorkspaceId

  return (
    <div className="container mx-auto max-w-3xl space-y-8 py-6">
      <SectionTitle />
      {fromWorkspaceSelect.workspaces.length > 0 && (
        <WorkspaceSelect {...fromWorkspaceSelect} />
      )}
      <SectionInfoEditor workspaceId={workspaceId} />
      <SectionDangerZone />
    </div>
  )
}

const SectionTitle = () => {
  return (
    <div>
      <h2 className="text-lg font-medium">General Settings</h2>
      <p className="text-sm text-muted-foreground">
        Manage your workspace settings and preferences.
      </p>
    </div>
  )
}

const SectionInfoEditor = ({workspaceId}: {workspaceId?: string}) =>
  workspaceId && <WorkspaceInfoEditor.Block workspaceId={workspaceId} />

const SectionDangerZone = () => (
  <Card>
    <CardHeader>
      <CardTitle>Danger Zone</CardTitle>
      <CardDescription>Irreversible and destructive actions.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Delete Workspace</p>
          <p className="text-sm text-muted-foreground">
            Permanently delete this workspace and all of its contents.
          </p>
        </div>
        <Button variant="destructive" onClick={() => {}}>
          Delete Workspace
        </Button>
      </div>
    </CardContent>
  </Card>
)
