import { Metadata } from 'next'

import { AcceptInvitePage } from '@/components/auth/accept-invite-page'

export const metadata: Metadata = {
  title: 'Accept Invite',
}

type Props = {
  params: Promise<{ invitationId: string }>
}

export default async function Page(props: Props) {
  const params = await props.params

  const { invitationId } = params

  return <AcceptInvitePage invitationId={invitationId} />
}
