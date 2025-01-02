import { ReactNode } from 'react'

type Props = {
  title: ReactNode
  value: ReactNode
  description?: ReactNode
}

export const Stat = ({ title, value, description }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card px-4 py-5 text-center sm:p-5">
      <dd className="mt-1 text-3xl font-semibold">{value}</dd>
      <dt className="truncate font-medium">{title}</dt>
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  )
}
