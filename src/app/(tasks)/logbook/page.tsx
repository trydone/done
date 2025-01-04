"use client";

import { TaskList } from "@/components/task/task-list";
import { useQuery } from "@rocicorp/zero/react";

export default function Page() {
  const zero = useZero();

  const q = zero.query.task;

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
