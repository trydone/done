"use client";
import { useQuery } from "@rocicorp/zero/react";

import { TaskList } from "@/components/task/task-list";
import { PageContainer } from "@/components/shared/page-container";
import { Section } from "@/components/shared/section";
import { H1 } from "@/components/shared/typography";
import { useZero } from "@/hooks/use-zero";
import { TrashIcon } from "lucide-react";

export default function PageTrash() {
  return (
    <PageContainer>
      <SectionTrash />
    </PageContainer>
  );
}

const SectionTrash = () => {
  const zero = useZero();

  const [tasks] = useQuery(
    zero.query.task
      .where("start", "=", "not_started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc")
      .related("tags")
      .related("checklistItems"),
  );

  return (
    <Section>
      <H1>
        <TrashIcon />
        Trash
      </H1>
      <TaskList tasks={tasks} />
    </Section>
  );
};
