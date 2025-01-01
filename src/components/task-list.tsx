import { TaskRow } from "@/schema";
import { TaskItem } from "./task-item";

type Props = {
  items: readonly TaskRow[];
};

export const TaskList = ({ items }: Props) => {
  return (
    <div>
      {items.map((item) => (
        <TaskItem key={item.id} item={item} />
      ))}
    </div>
  );
};
