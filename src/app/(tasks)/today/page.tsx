"use client";

import { TaskList } from "@/components/task/task-list";
import { useQuery } from "@rocicorp/zero/react";

export default function Page() {
  const zero = useZero();

  const q = zero.query.task;

  const [todayTasks] = useQuery(
    q
      .where("start_bucket", "=", "today")
      .where("start", "=", "started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc"),
  );

  const [eveningTasks] = useQuery(
    q
      .where("start_bucket", "=", "evening")
      .where("start", "=", "started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc"),
  );

  return (
    <div>
      <h1>Today</h1>

      <TaskList items={todayTasks} />

      <h1>Evening</h1>

      <TaskList items={eveningTasks} />
    </div>
  );
}
