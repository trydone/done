"use client";

import { PageContainer } from "@/components/shared/page-container";
import { H1 } from "@/components/shared/typography";
import { TaskList } from "@/components/task/task-list";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { ArchiveIcon } from "lucide-react";

export default function Page() {
  const zero = useZero();

  const [tasks] = useQuery(
    zero.query.task
      .where("start", "=", "someday")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc")
      .related("tags")
      .related("checklistItems", (q) => q.orderBy("sort_order", "asc")),
  );

  return (
    <PageContainer>
      <div className="flex gap-2 items-center mx-4 mb-6">
        <ArchiveIcon className="size-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Someday</h1>
      </div>

      <TaskList tasks={tasks} />
    </PageContainer>
  );
}
