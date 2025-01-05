import { cn } from "@/lib/utils";
import { TaskRow } from "@/schema";
import { useZero } from "@/hooks/use-zero";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";

type Props = {
  task: TaskRow;
};

export const TaskNotes = ({ task }: Props) => {
  const zero = useZero();

  const editor = useEditor({
    extensions: [StarterKit, Typography, Highlight],
    content: task.description || "",
    editorProps: {
      attributes: {
        class: cn(
          "w-full resize-none p-0 pb-4 pl-10 text-sm text-current leading-relaxed",
          "bg-transparent outline-none focus:outline-none focus:ring-0",
          "prose prose-sm max-w-none",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      zero.mutate.task.update({
        id: task.id,
        description: editor.getText(),
      });
    },
  });

  return <EditorContent editor={editor} className="w-full" />;
};
