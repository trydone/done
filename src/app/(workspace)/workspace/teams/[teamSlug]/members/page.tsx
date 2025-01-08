'use client'

import {useQuery} from '@rocicorp/zero/react'
import {ChevronLeft, MoreHorizontal, Plus, Search} from 'lucide-react'
import Link from 'next/link'
import {useMemo, useState} from 'react'
import {toast} from 'sonner'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  params: {workspaceSlug: string; teamSlug: string}
}

export default function Page({params: {}}: Props) {
  const zero = useZero()
  const [members] = useQuery(
    zero.query.team_member.related('user', (q) => q.one()),
  )
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        (member?.user?.name || '')
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (member?.user?.email || '')
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
  }, [members, search])

  const handleLeave = async (memberId: string) => {
    try {
      await zero.mutate.team_member.delete({id: memberId})
      toast.success('Member removed successfully')
    } catch (_error) {
      toast.error('Failed to remove member')
    }
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/teams" className="hover:opacity-80">
          <ChevronLeft className="size-6" />
        </Link>
        <div className="flex items-center space-x-3">
          <div className="flex size-6 items-center justify-center rounded bg-green-500/20">
            <span className="text-green-500">$</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Product team members
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex max-w-xl flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue>{filter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="mr-2 size-4" />
          Add a member
        </Button>
      </div>

      {/* Members Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.username}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {member.user.email}
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleLeave(member.id)}
                      className="text-red-600"
                    >
                      Leave team...
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
