import {observer} from 'mobx-react-lite'
import {useContext} from 'react'

import {RootStoreContext} from '@/lib/stores/root-store'

import {WhenDialog} from './when-dialog'

export const WhenDialogWrapper = observer(() => {
  const {
    localStore: {selectedTaskIds, whenOpen, setWhenOpen, whenState},
  } = useContext(RootStoreContext)

  return (
    <WhenDialog
      type={whenState.type as any}
      taskIds={whenState.type === 'multiple' ? selectedTaskIds : []}
      task={whenState.task}
      immediate={whenState.immediate}
      open={whenOpen}
      setOpen={setWhenOpen}
    />
  )
})
