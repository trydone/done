import { TaskRow } from "@/schema";
import { TaskItem } from "./task-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Props = {
  items: readonly TaskRow[];
};

export const TaskList = ({ items }: Props) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div>
        {/* {items.map((item) => (
          <TaskItem key={item.id} item={item} />
        ))} */}

        {items.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </SortableContext>
  );
};
