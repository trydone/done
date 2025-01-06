import { addDays, startOfDay } from 'date-fns'
import {
  CalendarIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { usePathname } from 'next/navigation'
import { useCallback, useContext, useState } from 'react'
import { v4 } from 'uuid'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useZero } from '@/hooks/use-zero'
import { RootStoreContext } from '@/lib/stores/root-store'

import { WhenDialog } from '../task/when-dialog'
import { FooterButton } from './footer-button'

export const Footer = observer(() => {
  const pathname = usePathname()
  const zero = useZero()
  const [whenOpen, setWhenOpen] = useState(false)

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
        start_date = startOfDay(new Date()).getTime() // Today at midnight
        break
      case '/anytime':
        start = 'not_started'
        start_bucket = 'today'
        start_date = null
        break
      case '/upcoming':
        start = 'postponed'
        start_bucket = 'today'
        // Set to tomorrow at midnight
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
    })

    setOpenTaskId(taskId)
  }, [pathname, selectedWorkspaceId, setOpenTaskId, zero.mutate.task])

  const handleQuickFind = () => {
    setQuickFindQuery('')
    setQuickFindOpen(true)
  }

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

        {/* {buttonStates.move !== "hidden" && (
          <Popover>
            <PopoverTrigger asChild>
              <FooterButton
                icon={ArrowRightIcon}
                title="Move"
                state={buttonStates.move}
              />
            </PopoverTrigger>

            <PopoverWrapper title="Move to">
              <Button variant="ghost" className="justify-start">
                Inbox
              </Button>
            </PopoverWrapper>
          </Popover>
        )} */}

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

        {buttonStates.moreActions !== 'hidden' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FooterButton
                title="More Actions"
                icon={MoreHorizontalIcon}
                state={buttonStates.moreActions}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 rounded-lg p-1">
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Repeat...
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Convert to Project...
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-1.5 text-sm">
                Share...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
