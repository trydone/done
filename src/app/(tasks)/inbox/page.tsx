"use client";

import { TaskList } from "@/components/task/task-list";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";

export default function Page() {
  const zero = useZero();

  const [tasks] = useQuery(zero.query.task);

  console.log({ tasks });

  return (
    <div>
      <h1>Inbox</h1>

      <TaskList items={tasks} />
    </div>
  );
}
