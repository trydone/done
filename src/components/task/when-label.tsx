import {useCallback, useContext} from 'react'

import {RootStoreContext} from '@/lib/stores/root-store'
import {TaskRow} from '@/schema'

import {Button} from '../ui/button'
import {getButtonIcon, getButtonText} from './when-dialog'

type Props = {
  task: TaskRow
}

export const WhenLabel = ({task}: Props) => {
  const {
    localStore: {setWhenOpen, setWhenState},
  } = useContext(RootStoreContext)

  const handleClick = useCallback(() => {
    setWhenState({type: 'single', task})
    setWhenOpen(true)
  }, [setWhenOpen, setWhenState, task])

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto gap-1.5 rounded-md p-1"
      onClick={handleClick}
    >
      {getButtonIcon(task)} {getButtonText(task)}
    </Button>
  )
}
