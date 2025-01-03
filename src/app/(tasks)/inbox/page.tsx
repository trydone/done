"use client";

import { TaskList } from "@/components/task/task-list";
import { useQuery, useZero } from "@rocicorp/zero/react";

export default function Page() {
  const z = useZero();

  const q = z.query.task;

  const [tasks] = useQuery(
    q
      .where("start", "=", "not_started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc"),
  );

  console.log(tasks);

  return (
    <div>
      <h1>Inbox</h1>

      <TaskList items={tasks} />
    </div>
  );
}
