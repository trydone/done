'use client'

import {useQuery} from '@rocicorp/zero/react'
import {ChevronRight, Users} from 'lucide-react'
import Link from 'next/link'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {useZero} from '@/hooks/use-zero'

type Props = {
  params: {workspaceSlug: string; teamSlug: string}
}

export default function Page({params: {workspaceSlug, teamSlug}}: Props) {
  const zero = useZero()
  const [team] = useQuery(zero.query.team)

  const handleDeleteTeam = async () => {
    try {
      await zero.mutate.team.delete({id: team?.id})
      toast.success('Team scheduled for deletion')
    } catch (_error) {
      toast.error('Failed to delete team')
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-6">
      {/* Team Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Team settings</CardTitle>
          <CardDescription>
            Configure how your team appears and is identified
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="flex items-center gap-2">
                <Input defaultValue="Product" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">
                Slug
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  Used in issue IDs
                </span>
              </label>
              <Input defaultValue="PRO" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <div className="space-y-2">
        <Link
          href={`/${workspaceSlug}/settings/teams/${teamSlug}/members`}
          className="flex items-center justify-between rounded-lg bg-muted/50 p-4 hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Users className="size-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Members</div>
              <div className="text-sm text-muted-foreground">
                Manage team members
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-muted-foreground">2 members</span> */}
            <ChevronRight className="size-4" />
          </div>
        </Link>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-t py-3">
            <div>
              <h3 className="font-medium">Delete team</h3>
              <p className="text-sm text-muted-foreground">
                Permanently remove this team and all of its data
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteTeam}>
              Delete team...
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
