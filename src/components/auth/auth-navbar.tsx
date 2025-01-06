import { LogoLink } from '@/components/ui/logo-link'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  isSticky?: boolean
}

export const AuthNavbar = ({ className, isSticky }: Props) => {
  return (
    <div
      className={cn(
        'flex min-h-[68px] items-center justify-center',
        className,
        {
          'sticky inset-x-0 top-0 z-[100] bg-background': isSticky,
        },
      )}
    >
      <LogoLink />
    </div>
  )
}
