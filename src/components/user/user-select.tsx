'use client'

import {useQuery} from '@rocicorp/zero/react'
import {useEffect, useMemo, useState} from 'react'

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {useZero} from '@/hooks/use-zero'
import {getUserInitials} from '@/lib/helpers'
import {UserRow} from '@/schema'

type ExtendedUserRow = UserRow & {
  profile: {
    id: string
    name: string
    avatar?: string | null
  }
}

type Compound = typeof View & {
  useBlock: typeof useBlock
  Block: typeof Block
}

export const View = ({
  users,
  selectedUser,
  selectedUserId,
  changeUser: changeProfile,
}: {
  users: readonly ExtendedUserRow[]
  selectedUser?: ExtendedUserRow
  selectedUserId?: string
  changeUser: (profileId: string) => void
}) => (
  <Select value={selectedUserId} onValueChange={changeProfile}>
    <SelectTrigger className="w-[280px]">
      <SelectValue placeholder="Select profile">
        {selectedUser && (
          <ProfileItem
            name={selectedUser.profile.name}
            avatar={selectedUser.profile.avatar}
            email={selectedUser.email}
            showEmail={false}
          />
        )}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {users.map((user) => (
        <SelectItem key={user.profile.id} value={user.profile.id}>
          <ProfileItem
            name={user.profile.name}
            avatar={user.profile.avatar}
            email={user.email}
            showEmail
          />
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const ProfileItem = ({
  name,
  avatar,
  email,
  showEmail,
}: {
  name: string
  avatar?: string | null
  email?: string | null
  showEmail: boolean
}) => (
  <div className="flex items-center gap-2">
    <Avatar className="size-6">
      <AvatarImage src={avatar || undefined} alt={name || 'Profile'} />
      <AvatarFallback>{getUserInitials(name || ``)}</AvatarFallback>
    </Avatar>
    <span className="max-w-[160px] truncate">{name}</span>
    {showEmail && (
      <span className="ml-2 text-xs text-muted-foreground">{email}</span>
    )}
  </div>
)

const useBlock = () => {
  const zero = useZero()

  const [sessions] = useQuery(
    zero.query.session.related('user', (q) =>
      q.one().related('profile', (q) => q.one()),
    ),
  )

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()

  const users = useMemo(() => {
    if (!sessions) {
      return []
    }
    return sessions
      .map((s) => s.user)
      .filter((user) => user?.profile?.id) as ExtendedUserRow[]
  }, [sessions])

  useEffect(() => {
    if (users[0]?.profile?.id && !selectedUserId) {
      setSelectedUserId(users[0]?.profile.id)
    }
  }, [users, selectedUserId])

  const changeProfile = async (profileId: string) => {
    setSelectedUserId(profileId)
  }

  const selectedUser = users.find((user) => user.profile.id === selectedUserId)

  return {
    users,
    selectedUser,
    selectedUserId,
    changeUser: changeProfile,
  }
}

const Block = () => {
  const fromUserSelect = useBlock()
  return <UserSelect {...fromUserSelect} />
}

// @ts-expect-error compound
export const UserSelect: Compound = View
UserSelect.useBlock = useBlock
UserSelect.Block = Block
