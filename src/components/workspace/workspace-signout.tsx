"use client";
import * as React from "react";
import { useQuery } from "@rocicorp/zero/react";
import { Schema } from "@/schema";
import { Button } from "@/components/ui/button";
import { RootStoreContext } from "@/lib/stores/root-store";
import { observer } from "mobx-react-lite";
import { useZero } from "@/hooks/use-zero";

interface Compound
  extends React.FC<{
    onSignout: () => void;
  }> {
  Block: React.FC<{
    userId: string;
  }>;
}

export const WorkspaceSignout: Compound = ({ onSignout }) => (
  <Button variant="link" onClick={onSignout}>
    Sign out
  </Button>
);

const Block: Compound["Block"] = observer(({ userId }) => {
  const zero = useZero();

  const [sessions] = useQuery(zero.query.session);

  const {
    localStore: { clearWorkspace, selectedUserId },
  } = React.useContext(RootStoreContext);

  const onSignout = () => {
    const sessionId = sessions[0]?.id;
    if (sessionId) {
      if (selectedUserId === userId) {
        clearWorkspace();
      }
      zero.mutate.session.delete({ id: sessionId, user_id: userId });
    }
  };

  return <WorkspaceSignout onSignout={onSignout} />;
});

WorkspaceSignout.Block = Block;
