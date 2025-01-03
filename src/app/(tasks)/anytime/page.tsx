"use client";

import { TaskList } from "@/components/task/task-list";
import { useQuery } from "@rocicorp/zero/react";

export default function Page() {
  const zero = useZero();

  const q = zero.query.task;

  const [tasks] = useQuery(
    q
      .where("start", "=", "started")
      .where("start_date", "IS", null)
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc"),
  );

  return (
    <div>
      <h1>Anytime</h1>

      <TaskList items={tasks} />
    </div>
  );
}
