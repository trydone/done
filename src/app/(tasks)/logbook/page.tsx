"use client";

import { TaskList } from "@/components/task-list";
import { useQuery, useZero } from "@rocicorp/zero/react";

export default function Page() {
  const z = useZero();

  const q = z.query.task;

  const [tasks] = useQuery(
    q
      .where("archived_at", "IS", null)
      .where("completed_at", "IS NOT", null)
      .orderBy("sort_order", "asc"),
  );

  console.log(tasks);

  return (
    <div>
      <h1>Logbook</h1>

      <TaskList items={tasks} />
    </div>
  );
}
