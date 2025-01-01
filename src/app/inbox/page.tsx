"use client";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { Schema } from "@/schema";
import { TaskList } from "@/components/task-list";

export default function Page() {
  const zero = useZero<Schema>();

  const [tasks] = useQuery(
    zero.query.task
      .where("start", "=", "not_started")
      .where("archived_at", "IS", null)
      .where("completed_at", "IS", null)
      .orderBy("sort_order", "asc")
  );

  console.log({ tasks });

  return (
    <div>
      <h1>Inbox</h1>

      <TaskList items={tasks} />
    </div>
  );
}
