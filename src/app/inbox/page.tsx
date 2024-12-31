"use client";
import { TaskItem } from "@/components/task-item";
import { TaskList } from "@/components/task-list";
import { useQuery, useZero } from "@rocicorp/zero/react";

export default function Page() {
  const z = useZero();

  const q = z.query.task;

  const [tasks] = useQuery(
    q.where("start", "=", "not_started").orderBy("sort_order", "asc"),
  );

  console.log(tasks);

  return (
    <div>
      <h1>Inbox</h1>

      <TaskList items={tasks as any} />
    </div>
  );
}
