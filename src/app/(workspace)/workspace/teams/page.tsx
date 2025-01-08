'use client'

import {useQuery} from '@rocicorp/zero/react'
import {Plus, Search} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useMemo, useState} from 'react'

import {Button} from '@/components/ui/button'
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
  const router = useRouter()
  const [teams] = useQuery(zero.query.team)
  const [search, setSearch] = useState('')

  const filteredTeams = useMemo(() => {
    return teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [teams, search])

  const handleCreateTeam = () => {
    router.push('/teams/new')
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
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
        <Button onClick={handleCreateTeam}>
          <Plus className="mr-2 size-4" />
          Create team
        </Button>
      </div>

      {/* Teams Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{team.name}</span>
                </div>
              </TableCell>

              <TableCell>
                {new Date(team.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
