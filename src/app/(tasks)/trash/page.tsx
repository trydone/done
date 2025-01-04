"use client";
import { useQuery } from "@rocicorp/zero/react";

import { TaskList } from "@/components/task/task-list";
import { Page } from "@/components/shared/page";
import { Section } from "@/components/shared/section";
import { H1 } from "@/components/shared/typography";
import { Schema } from "@/schema";
import { useZero } from "@/hooks/use-zero";

export default function PageInbox() {
  return (
    <Page>
      <SectionInbox />
    </Page>
  );
}

const SectionInbox = () => {
  const zero = useZero();

  const [tasks] = useQuery(
    zero.query.task
      .where("start", "=", "not_started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc"),
  );

  return (
    <Section>
      <H1>Inbox</H1>
      <TaskList items={tasks} />
    </Section>
  );
};
