import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import {useZero} from '@/hooks/use-zero'
import {cn} from '@/lib/utils'
import {TaskRow} from '@/schema'

type Props = {
  task: TaskRow
}

export const TaskNotes = ({task}: Props) => {
  const zero = useZero()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Highlight,
      Placeholder.configure({
        placeholder: 'Notes',
      }),
    ],
    content: task.description || '',
    editorProps: {
      attributes: {
        class: cn(
          'w-full resize-none p-0 pb-4 pl-10 text-current [&_*]:text-current',
          'bg-transparent outline-none focus:outline-none focus:ring-0',
          'prose prose-sm max-w-none',
        ),
      },
    },
    onUpdate: ({editor}) => {
      const html = editor.isEmpty ? '' : editor.getHTML()
      zero.mutate.task.update({
        id: task.id,
        description: html,
      })
    },
  })

  return <EditorContent editor={editor} className="w-full" />
}
