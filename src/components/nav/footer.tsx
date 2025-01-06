import { useQuery } from '@rocicorp/zero/react'
import { addDays, startOfDay } from 'date-fns'
import { CalendarIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { usePathname } from 'next/navigation'
import { useCallback, useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { v4 } from 'uuid'

import { useZero } from '@/hooks/use-zero'
import { INITIAL_GAP } from '@/lib/constants'
import { RootStoreContext } from '@/lib/stores/root-store'

import { WhenDialog } from '../task/when-dialog'
import { FooterButton } from './footer-button'

export const Footer = observer(() => {
  const pathname = usePathname()
  const zero = useZero()
  const [whenOpen, setWhenOpen] = useState(false)

  const [firstTask] = useQuery(
    zero.query.task.orderBy('sort_order', 'asc').one(),
  )

  const {
    localStore: {
      openTaskId,
      setOpenTaskId,
      setQuickFindQuery,
      buttonStates,
      selectedWorkspaceId,
      selectedTaskIds,
      setQuickFindOpen,
    },
  } = useContext(RootStoreContext)

  const handleDelete = useCallback(async () => {
    if (!openTaskId) {
      return
    }

    await zero.mutate.task.update({
      id: openTaskId,
      archived_at: Date.now(),
    })

    setOpenTaskId(null)
  }, [openTaskId, setOpenTaskId, zero.mutate.task])

  const handleNewTask = useCallback(async () => {
    const taskId = v4()

    // Default values
    let start = 'not_started'
    let start_bucket = 'today'
    let start_date = null

    switch (pathname) {
      case '/today':
        start = 'started'
        start_bucket = 'today'
        start_date = startOfDay(new Date()).getTime()
        break
      case '/anytime':
        start = 'not_started'
        start_bucket = 'today'
        start_date = null
        break
      case '/upcoming':
        start = 'postponed'
        start_bucket = 'today'
        start_date = addDays(startOfDay(new Date()), 1).getTime()
        break
      case '/someday':
        start = 'postponed'
        start_bucket = 'today'
        start_date = null
        break
      case '/inbox':
      default:
        start = 'not_started'
        start_bucket = 'today'
        start_date = null
        break
    }

    // Calculate top sort order
    const newSortOrder = firstTask
      ? firstTask.sort_order - INITIAL_GAP
      : INITIAL_GAP

    await zero.mutate.task.insert({
      id: taskId,
      workspace_id:
        selectedWorkspaceId || `9d190060-d582-4136-827d-cd0468d081ec`,
      title: '',
      description: '',
      created_at: Date.now(),
      creator_id: '9ecb970e-0fee-4dfd-9721-2c04c8ed7607',
      updated_at: Date.now(),
      start,
      start_bucket,
      start_date,
      sort_order: newSortOrder,
      today_sort_order: newSortOrder,
    })

    setOpenTaskId(taskId)
  }, [
    pathname,
    firstTask,
    zero.mutate.task,
    selectedWorkspaceId,
    setOpenTaskId,
  ])

  const handleQuickFind = () => {
    setQuickFindQuery('')
    setQuickFindOpen(true)
  }

  useHotkeys(
    'n',
    (e) => {
      e.preventDefault()
      handleNewTask()
    },
    {
      enabled: buttonStates.newTask === 'visible',
    },
  )

  useHotkeys(
    'meta+k',
    (e) => {
      e.preventDefault()
      handleQuickFind()
    },
    {
      enabled: buttonStates.quickFind === 'visible',
    },
  )

  useHotkeys(
    'backspace, delete',
    (e) => {
      e.preventDefault()

      if (selectedTaskIds.length > 0) {
        selectedTaskIds.forEach(async (taskId) => {
          await zero.mutate.task.update({
            id: taskId,
            archived_at: Date.now(),
          })
        })
      } else if (openTaskId) {
        handleDelete()
      }
    },
    {
      enabled: !!openTaskId || selectedTaskIds.length > 0,
    },
  )

  return (
    <>
      <footer className="flex w-full items-center justify-between gap-1 border-t bg-background p-2">
        <FooterButton
          icon={PlusIcon}
          title="New To-Do"
          onClick={handleNewTask}
          state={
            buttonStates.newTask === 'visible' &&
            ['/logbook', '/trash'].includes(pathname)
              ? 'disabled'
              : buttonStates.newTask
          }
        />

        {buttonStates.when !== 'hidden' && (
          <FooterButton
            icon={CalendarIcon}
            title="When"
            state={buttonStates.when}
            onClick={() => setWhenOpen(true)}
          />
        )}

        <FooterButton
          icon={SearchIcon}
          title="Quick Find"
          onClick={handleQuickFind}
          state={buttonStates.quickFind}
        />

        <FooterButton
          icon={TrashIcon}
          title="Delete"
          onClick={handleDelete}
          state={buttonStates.delete}
        />
      </footer>

      {whenOpen && (
        <WhenDialog
          type="multiple"
          taskIds={selectedTaskIds}
          open={whenOpen}
          setOpen={setWhenOpen}
        />
      )}
    </>
  )
})
