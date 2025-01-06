'use client'

import {useQuery} from '@rocicorp/zero/react'
import {observer} from 'mobx-react-lite'
import {FC, useContext} from 'react'

import {Button} from '@/components/ui/button'
import {useZero} from '@/hooks/use-zero'
import {RootStoreContext} from '@/lib/stores/root-store'

interface Compound
  extends FC<{
    onSignout: () => void
  }> {
  Block: FC<{
    userId: string
  }>
}

export const WorkspaceSignout: Compound = ({onSignout}) => (
  <Button variant="link" onClick={onSignout}>
    Sign out
  </Button>
)

const Block: Compound['Block'] = observer(({userId}) => {
  const zero = useZero()

  const [sessions] = useQuery(zero.query.session)

  const {
    localStore: {clearWorkspace, selectedUserId},
  } = useContext(RootStoreContext)

  const onSignout = () => {
    const sessionId = sessions[0]?.id
    if (sessionId) {
      if (selectedUserId === userId) {
        clearWorkspace()
      }
      zero.mutate.session.delete({id: sessionId, user_id: userId})
    }
  }

  return <WorkspaceSignout onSignout={onSignout} />
})

WorkspaceSignout.Block = Block
