import {ReactNode} from 'react'

export default async function Layout({children}: {children: ReactNode}) {
  return (
    <>
      <div className="min-h-full bg-background bg-gradient-to-b from-[#D5ECFE] to-background dark:from-card dark:to-card">
        <div className="container mx-auto max-w-lg px-4">{children}</div>
      </div>
    </>
  )
}
