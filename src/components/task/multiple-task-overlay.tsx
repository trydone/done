import {ClipboardIcon} from 'lucide-react'

type Props = {
  count: number
}

export const MultipleTasksOverlay = ({count}: Props) => (
  <div className="rounded-lg border bg-white p-3 shadow-lg">
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-blue-100 p-2">
        <ClipboardIcon className="size-4 text-blue-600" />
      </div>
      <span className="font-medium">{count} tasks selected</span>
    </div>
  </div>
)
