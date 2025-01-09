import {useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'

import {RootStoreContext} from '@/lib/stores/root-store'

export const useTaskSelection = (taskIds: string[]) => {
  const {
    localStore: {
      moveTaskSelection,
      toggleTaskSelection,
      openTaskId,
      selectedTaskIds,
      setSelectedTaskIds,
      setOpenTaskId,
      lastSelectedTaskId,
    },
  } = useContext(RootStoreContext)

  useHotkeys(
    'enter',
    (e) => {
      e.preventDefault()
      if (selectedTaskIds.size > 0) {
        setSelectedTaskIds([])
        setOpenTaskId(lastSelectedTaskId)
      }
    },
    {
      enabled: !openTaskId && selectedTaskIds.size > 0,
    },
  )

  useHotkeys(
    'up',
    (e) => {
      e.preventDefault()
      moveTaskSelection('up', taskIds)
    },
    {
      enabled: !openTaskId,
    },
  )

  useHotkeys(
    'down',
    (e) => {
      e.preventDefault()
      moveTaskSelection('down', taskIds)
    },
    {
      enabled: !openTaskId,
    },
  )

  const handleClick = (id: string, event: React.MouseEvent) => {
    toggleTaskSelection(
      id,
      event.metaKey || event.ctrlKey,
      event.shiftKey,
      taskIds,
    )
  }

  return {
    handleClick,
  }
}
