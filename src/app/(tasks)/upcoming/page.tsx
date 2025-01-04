"use client";

import { TaskList } from "@/components/task/task-list";
import { useQuery } from "@rocicorp/zero/react";

export default function Page() {
  const zero = useZero();

  const q = zero.query.task;

  const [tasks] = useQuery(
    q
      .where("start", "=", "started")
      .where("start_date", ">", new Date().toISOString())
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc"),
  );

  return (
    <div>
      <h1>Upcoming</h1>

      <TaskList items={tasks} />
    </div>
  );
}
