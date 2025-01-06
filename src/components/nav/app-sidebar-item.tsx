import { useDroppable } from '@dnd-kit/core'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { useDndContext } from '../dnd/dnd-context'
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

type Props = {
  item: any
}

export const AppSidebarItem = observer(({ item }: Props) => {
  const { isDragging } = useDndContext()
  const { setNodeRef, isOver } = useDroppable({
    id: item.id,
    data: {
      type: 'bucket',
    },
  })

  return (
    <SidebarMenuItem
      key={item.title}
      ref={setNodeRef}
      className={cn(
        isOver && isDragging && 'border-2 border-blue-200 bg-blue-50',
        !isOver && 'hover:bg-muted',
      )}
    >
      <SidebarMenuButton asChild>
        <Link href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})
