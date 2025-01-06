import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'trydone.io',
}

export default function Page() {
  return (
    <div className="container mx-auto px-4 pt-6">
      <Link href="/inbox" className="underline">
        Go to Done inbox
      </Link>
    </div>
  )
}
