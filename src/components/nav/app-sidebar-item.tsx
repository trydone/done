import {useDroppable} from '@dnd-kit/core'
import {LucideProps} from 'lucide-react'
import {observer} from 'mobx-react-lite'
import Link from 'next/link'
import {ForwardRefExoticComponent, RefAttributes} from 'react'

import {cn} from '@/lib/utils'

import {useDndContext} from '../dnd/dnd-context'
import {SidebarMenuButton, SidebarMenuItem} from '../ui/sidebar'

export type AppSidebarItemType = {
  id: string
  title: string
  url: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
}

type Props = {
  item: AppSidebarItemType
  count: number | undefined
}

export const AppSidebarItem = observer(({item, count}: Props) => {
  const {isDragging} = useDndContext()
  const {setNodeRef, isOver} = useDroppable({
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
        <Link href={item.url} className="flex items-center gap-2">
          <item.icon className="size-4" />

          <div className="flex-1">
            <span>{item.title}</span>
          </div>

          {(count || 0) > 0 && <span>{count}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})
