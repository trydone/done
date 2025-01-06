import { observer } from 'mobx-react-lite'

import { TaskRow } from '@/schema'

import { Button } from '../ui/button'
import { getButtonIcon, getButtonText } from './when-dialog'

type Props = {
  task: TaskRow
  setOpen: (open: boolean) => void
}

export const WhenLabel = observer(({ task, setOpen }: Props) => {
  return (
    <Button
      variant="ghost"
      className="flex h-auto items-center gap-2 px-2 py-1 text-sm"
      onClick={() => setOpen(true)}
    >
      {getButtonIcon(task)} {getButtonText(task)}
    </Button>
  )
})
