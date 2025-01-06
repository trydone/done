'use client'

import {useQuery} from '@rocicorp/zero/react'
import {ChevronLeft, Download, MoreHorizontal, Plus, Search} from 'lucide-react'
import Link from 'next/link'
import {useMemo, useState} from 'react'

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
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
import {cn} from '@/lib/utils'

type Props = {
  params: {workspaceSlug: string}
}

export default function Page({params: {}}: Props) {
  const zero = useZero()
  const [members] = useQuery(zero.query.workspace_member)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Admin' | 'Member'>('All')

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.username.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'All' || member.role === filter
      return matchesSearch && matchesFilter
    })
  }, [members, search, filter])

  const exportCSV = () => {
    const csv = [
      ['Name', 'Username', 'Email', 'Role', 'Joined'],
      ...filteredMembers.map((member) => [
        member.name,
        member.username,
        member.username,
        member.role,
        new Date(member.joinedAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], {type: 'text/csv'})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'members.csv'
    a.click()
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/teams" className="hover:opacity-80">
          <ChevronLeft className="size-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Product team members
          </h1>
          <p className="text-muted-foreground">
            Manage team members and their roles
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{filter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('All')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Admin')}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Member')}>
                Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button>
            <Plus className="mr-2 size-4" />
            Add a member
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {member.isOnline && (
                      <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-background" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.username}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{member.user.username}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    member.role === 'Admin'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {member.role}
                </span>
              </TableCell>
              <TableCell>
                {new Date(member.joinedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit role</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Remove from team
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
