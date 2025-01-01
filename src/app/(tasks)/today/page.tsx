"use client";

import { TaskList } from "@/components/task-list";
import { useQuery, useZero } from "@rocicorp/zero/react";

export default function Page() {
  const z = useZero();

  const q = z.query.task;

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

  console.log(todayTasks, eveningTasks);

  return (
    <div>
      <h1>Today</h1>

      <TaskList items={todayTasks} />

      <h1>Evening</h1>

      <TaskList items={eveningTasks} />
    </div>
  );
}
