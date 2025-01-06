import Link from 'next/link'

import { ConditionalWrapper } from './conditional-wrapper'

type Props = {
  href?: string
  hasLink?: boolean
}

export const LogoLink = ({ href = '/', hasLink = true }: Props) => {
  return (
    <ConditionalWrapper
      condition={hasLink}
      wrapper={(children) => (
        <Link href={href} className="flex items-center">
          {children}
        </Link>
      )}
    >
      <span className="font-black">Done</span>
    </ConditionalWrapper>
  )
}
