"use client";
import { useQuery, useZero } from "@rocicorp/zero/react";

export default function Page() {
  const z = useZero();

  const q = z.query.task;

  const [tasks] = useQuery(q);

  console.log(tasks);

  return <div>Trash</div>;
}
