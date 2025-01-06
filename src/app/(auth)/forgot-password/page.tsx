import { ArrowRightIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { AuthNavbar } from '@/components/auth/auth-navbar'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    'Recover access to your Done account. Follow our secure password reset process to regain access to your forms and responses.',
}

export default async function Page() {
  return (
    <>
      <AuthNavbar />

      <div className="rounded-3xl border border-border bg-background px-4 py-6 shadow-sm dark:shadow-none">
        <h1 className="h3 mb-6 text-center">Reset your password</h1>

        <ForgotPasswordForm />

        <p className="mb-4 mt-6 flex flex-wrap items-center justify-center text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="group flex items-center font-medium text-primary"
          >
            Sign in
            <ArrowRightIcon
              width={16}
              height={16}
              className="ml-0.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </p>
      </div>
    </>
  )
}
