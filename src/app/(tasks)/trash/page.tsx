"use client";
import { useQuery, useZero } from "@rocicorp/zero/react";

import { TaskList } from "@/components/task-list";
import { WorkspaceSwitch } from "@/components/workspace/workspace-switch";
import { Page } from "@/components/shared/page";
import { Section } from "@/components/shared/section";
import { H1 } from "@/components/shared/typography";
import { Schema } from "@/schema";

export default function PageInbox() {
  return (
    <Page>
      <SectionInbox />
      <SectionWorkspaces />
    </Page>
  );
}

const SectionInbox = () => {
  const zero = useZero<Schema>();

  const [tasks] = useQuery(
    zero.query.task
      .where("start", "=", "not_started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc")
  );

  return (
    <Section>
      <H1>Inbox</H1>
      <TaskList items={tasks} />
    </Section>
  );
};

const SectionWorkspaces = () => {
  return (
    <Section>
      <H1>Workspaces</H1>
      <WorkspaceSwitch.Block />
    </Section>
  );
};
