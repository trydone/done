"use client";

import { PageContainer } from "@/components/shared/page-container";
import { H1 } from "@/components/shared/typography";
import { TaskList } from "@/components/task/task-list";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { StarIcon } from "lucide-react";

export default function Page() {
  const zero = useZero();

  const [todayTasks] = useQuery(
    zero.query.task
      .where("start_bucket", "=", "today")
      .where("start", "=", "started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc")
      .related("tags")
      .related("checklistItems"),
  );

  const [eveningTasks] = useQuery(
    zero.query.task
      .where("start_bucket", "=", "evening")
      .where("start", "=", "started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc")
      .related("tags")
      .related("checklistItems"),
  );

  return (
    <PageContainer>
      <H1>
        <StarIcon />
        Today
      </H1>

      <TaskList tasks={todayTasks} />

      {eveningTasks.length > 0 && (
        <>
          <H1>Evening</H1>

          <TaskList tasks={eveningTasks} />
        </>
      )}
    </PageContainer>
  );
}
