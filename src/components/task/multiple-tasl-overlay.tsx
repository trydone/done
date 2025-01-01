import { ClipboardIcon } from "lucide-react";

type Props = {
  count: number;
};

export const MultipleTasksOverlay = ({ count }: Props) => (
  <div className="bg-white border rounded-lg p-3 shadow-lg">
    <div className="flex items-center gap-2">
      <div className="bg-blue-100 rounded-lg p-2">
        <ClipboardIcon className="w-4 h-4 text-blue-600" />
      </div>
      <span className="font-medium">{count} tasks selected</span>
    </div>
  </div>
);
