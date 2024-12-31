import { taskSchema } from "@/schema";
import { Row } from "@rocicorp/zero";
import { TaskItem } from "./task-item";

type Props = {
  items: Row<typeof taskSchema>[];
};

export const TaskList = ({ items }: Props) => {
  return (
    <div>
      {items.map((item) => (
        <TaskItem key={item.id} item={item as any} />
      ))}
    </div>
  );
};
