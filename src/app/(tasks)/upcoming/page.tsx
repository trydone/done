"use client";

import { PageContainer } from "@/components/shared/page-container";
import { H1 } from "@/components/shared/typography";
import { TaskList } from "@/components/task/task-list";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { CalendarIcon } from "lucide-react";

export default function Page() {
  const zero = useZero();

  const [tasks] = useQuery(
    zero.query.task
      .where("start", "=", "started")
      .where("start_date", ">", Math.floor(Date.now() / 1000))
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc")
      .related("tags")
      .related("checklistItems"),
  );

  return (
    <PageContainer>
      <div className="flex gap-2 items-center">
        <CalendarIcon className="size-6" />
        <h1 className="text-2xl font-bold tracking-tight">Upcoming</h1>
      </div>

      <TaskList tasks={tasks} />
    </PageContainer>
  );
}
