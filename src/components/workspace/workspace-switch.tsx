"use client";
import * as React from "react";
import { observer } from "mobx-react-lite";
import { useQuery, useZero } from "@rocicorp/zero/react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Schema, WorkspaceRow } from "@/schema";
import { RootStoreContext } from "@/lib/stores/root-store";

interface Compound
  extends React.FC<{
    selectedWorkspaceId?: string;
    workspaces?: readonly WorkspaceRow[];
    onWorkspaceChange: (workspaceId: string) => void;
  }> {
  Block: React.FC;
}

export const WorkspaceSwitch: Compound = ({
  selectedWorkspaceId,
  workspaces,
  onWorkspaceChange,
}) => (
  <RadioGroup value={selectedWorkspaceId} onValueChange={onWorkspaceChange}>
    {workspaces?.map((workspace) => (
      <div key={workspace.id} className="flex items-center space-x-2">
        <RadioGroupItem value={workspace.id} id={workspace.id} />
        <Label htmlFor={workspace.id}>{workspace.name}</Label>
      </div>
    ))}
  </RadioGroup>
);

const Block: Compound["Block"] = observer(() => {
  const zero = useZero<Schema>();
  const [workspaces] = useQuery(zero.query.workspace);

  const {
    localStore: { changeWorkspace, selectedWorkspaceId },
  } = React.useContext(RootStoreContext);

  return (
    <WorkspaceSwitch
      selectedWorkspaceId={selectedWorkspaceId}
      workspaces={workspaces}
      onWorkspaceChange={changeWorkspace}
    />
  );
});

WorkspaceSwitch.Block = Block;
