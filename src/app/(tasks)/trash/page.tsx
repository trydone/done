"use client";
import { useQuery } from "@rocicorp/zero/react";

import { TaskList } from "@/components/task/task-list";
import { PageContainer } from "@/components/shared/page-container";
import { Section } from "@/components/shared/section";
import { H1, H2 } from "@/components/shared/typography";
import { useZero } from "@/hooks/use-zero";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export default function PageTrash() {
  return (
    <PageContainer>
      <SectionTrash />
    </PageContainer>
  );
}

const SectionTrash = () => {
  const zero = useZero();

  const [tasks] = useQuery(
    zero.query.task
      .where("archived_at", "IS NOT", null)
      .orderBy("archived_at", "asc")
      .related("tags")
      .related("checklistItems"),
  );

  const handleEmptyTrash = useCallback(() => {
    // Loop through each task and delete it
    (tasks || []).forEach((task) => {
      zero.mutate.task.delete({
        id: task.id,
      });
    });
  }, []);

  return (
    <Section>
      <div className="flex gap-2 items-center">
        <TrashIcon className="size-6" />
        <h1 className="text-2xl font-bold tracking-tight">Trash</h1>
      </div>

      {tasks.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <TrashIcon className="size-16 opacity-30" />
        </div>
      ) : (
        <div>
          <Button onClick={handleEmptyTrash} size="sm" variant="destructive">
            Empty Trash
          </Button>
        </div>
      )}
      <TaskList tasks={tasks} />
    </Section>
  );
};
