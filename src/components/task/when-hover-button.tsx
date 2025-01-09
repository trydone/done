import {CalendarIcon} from 'lucide-react'
import {observer} from 'mobx-react-lite'
import {useCallback, useContext} from 'react'

import {Button} from '@/components/ui/button'
import {RootStoreContext} from '@/lib/stores/root-store'
import {TaskRow} from '@/schema'

type Props = {
  task: TaskRow
}

export const WhenHoverButton = observer(({task}: Props) => {
  const {
    localStore: {setWhenOpen, setWhenState, selectedTaskIds},
  } = useContext(RootStoreContext)

  const handleClick = useCallback(() => {
    if (!selectedTaskIds.has(task.id)) {
      setWhenState({type: 'single', task, immediate: true})
    } else {
      setWhenState({type: 'multiple'})
    }

    setWhenOpen(true)
  }, [selectedTaskIds, setWhenOpen, setWhenState, task])

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto gap-1.5 rounded-md p-1 opacity-0 hover:!bg-transparent hover:opacity-60"
      onClick={handleClick}
    >
      <CalendarIcon className="size-4" />
    </Button>
  )
})
