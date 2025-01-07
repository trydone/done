import {AnimatePresence, motion} from 'framer-motion'
import {observer} from 'mobx-react-lite'
import {useCallback, useContext, useEffect, useRef, useState} from 'react'

import {useZero} from '@/hooks/use-zero'
import {RootStoreContext} from '@/lib/stores/root-store'

import {DndListData} from '../dnd/dnd-context'
import {TaskItem} from './task-item'
import {TaskItemDetails} from './task-item-details'
import {Task} from './types'

type Props = {
  task: Task
  isDragging?: boolean
  isSelected?: boolean
  showWhenIcon?: boolean
  showDashedCheckbox?: boolean
  noRadiusTop?: boolean
  noRadiusBottom?: boolean
  listData: DndListData
}

export const TaskItemWrapper = observer(({task, ...props}: Props) => {
  const zero = useZero()
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  const [isCheckedLocally, setIsCheckedLocally] = useState(!!task.completed_at)

  const {
    localStore: {openTaskId},
  } = useContext(RootStoreContext)

  const handleComplete = useCallback(
    async (checked: boolean) => {
      setIsCheckedLocally(checked)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (!checked) {
        await zero.mutate.task.update({
          id: task.id,
          completed_at: null,
        })
        return
      }
      timeoutRef.current = setTimeout(async () => {
        await zero.mutate.task.update({
          id: task.id,
          completed_at: Date.now(),
        })
      }, 3000)
    },
    [task.id, zero.mutate.task],
  )

  const isOpen = openTaskId === task.id

  useEffect(() => {
    setIsCheckedLocally(!!task.completed_at)
  }, [task.completed_at])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{height: 48}}
          animate={{height: 'auto'}}
          exit={{height: 48}}
          transition={{duration: 0.2}}
        >
          <TaskItemDetails
            task={task}
            onComplete={handleComplete}
            checked={isCheckedLocally}
            showDashedCheckbox={props.showDashedCheckbox}
          />
        </motion.div>
      ) : (
        <TaskItem
          task={task}
          {...props}
          onComplete={handleComplete}
          checked={isCheckedLocally}
        />
      )}
    </AnimatePresence>
  )
})
