import {ReactNode} from 'react'

export const PageContainer = ({children}: {children: ReactNode}) => {
  return (
    <div className="task-outside-click flex flex-col gap-2">{children}</div>
  )
}
