import { taskSchema } from "@/schema";
import { Row } from "@rocicorp/zero";

type Props = {
  item: Row<typeof taskSchema>;
};

export const TaskItem = ({ item }: Props) => {
  return <div>{item.title}</div>;
};
