import {observer} from 'mobx-react-lite'

import {TaskRow} from '@/schema'

import {Button} from '../ui/button'
import {getButtonIcon, getButtonText} from './when-dialog'

type Props = {
  task: TaskRow
  setOpen: (open: boolean) => void
}

export const WhenLabel = observer(({task, setOpen}: Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={() => setOpen(true)}
    >
      {getButtonIcon(task)} {getButtonText(task)}
    </Button>
  )
})
