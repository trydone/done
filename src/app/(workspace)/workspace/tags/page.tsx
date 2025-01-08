'use client'

import {useQuery} from '@rocicorp/zero/react'
import {MoreHorizontal, Plus, Search} from 'lucide-react'
import {useMemo, useState} from 'react'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Input} from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {useZero} from '@/hooks/use-zero'

type Props = {
  params: {workspaceSlug: string}
}

export default function Page({params: {}}: Props) {
  const zero = useZero()
  const [tags] = useQuery(zero.query.tag.orderBy('updated_at', 'desc'))
  const [search, setSearch] = useState('')

  const filteredTags = useMemo(() => {
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [tags, search])

  const handleNewTag = () => {
    // Implement new tag creation
    toast.info('New tag creation coming soon')
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Issue tags</h1>
        <p className="text-muted-foreground">
          Manage and organize your issue tags
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleNewTag}>
            <Plus className="mr-2 size-4" />
            New tag
          </Button>
        </div>
      </div>

      {/* Tags Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`size-3 rounded-full`} />
                  <span>{tag.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(tag.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>
                {new Date(tag.updated_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit tag</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete tag
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
