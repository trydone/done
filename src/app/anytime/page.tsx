"use client";
import { TaskList } from "@/components/task-list";
import { useQuery, useZero } from "@rocicorp/zero/react";

export default function Page() {
  const z = useZero();

  const q = z.query.task;

  const [tasks] = useQuery(q);

  console.log(tasks);

  return (
    <div>
      Anytime
      <TaskList items={tasks as any} />
    </div>
  );
}
