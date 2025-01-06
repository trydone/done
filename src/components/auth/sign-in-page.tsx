'use client'
// import { AppleIcon, FacebookIcon, GoogleIcon } from "lucide-react";
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import { useState } from 'react'

import { AuthNavbar } from '@/components/auth/auth-navbar'
import { SignInForm } from '@/components/auth/sign-in-form'
import { ButtonDiv } from '@/components/ui/button'

type Provider = 'google' | 'apple' | 'facebook'

const getReturnTo = (returnTo?: string | null): string => {
  if (!returnTo) {
    return `/sites`
  }

  return returnTo
}

export const SignInPage = () => {
  const [_loading, _setLoading] = useState<Provider | undefined>()
  const searchParams = useSearchParams()

  const returnTo = searchParams?.get('returnTo')

  const queryParams = queryString.stringify({
    returnTo: getReturnTo(returnTo),
  })

  // const handleOAuthSignIn = useCallback(
  //   async (provider: Provider) => {
  //     try {
  //       setLoading(provider);
  //       // setCookie(RETURN_TO_KEY, getReturnTo(returnTo));

  //       // const { error } = await supabase.auth.signInWithOAuth({
  //       //   provider,
  //       //   options: {
  //       //     redirectTo: `${clientGetUrl()}/auth/callback`,
  //       //   },
  //       // });

  //       // if (error) {
  //       //   throw error;
  //       // }
  //     } catch (error: any) {
  //       toast.error(error.message);
  //       setLoading(undefined);
  //     }
  //   },
  //   [returnTo],
  // );

  return (
    <>
      <AuthNavbar />

      <div className="rounded-3xl border border-border bg-background px-4 py-6 shadow-sm dark:shadow-none">
        <h1 className="h3 mb-6 text-center">Sign in</h1>

        {/* <div className="mb-8 flex flex-row justify-center space-x-3">
          <Button
            onClick={() => handleOAuthSignIn("google")}
            className="group w-full"
            variant="muted"
            loading={loading === "google"}
            title="Sign in with Google"
          >
            <GoogleIcon
              width={24}
              height={24}
              className="transition-transform group-hover:scale-95"
            />
          </Button>

          <Button
            onClick={() => handleOAuthSignIn("apple")}
            className="group w-full"
            variant="muted"
            loading={loading === "apple"}
            title="Sign in with Apple"
          >
            <AppleIcon
              width={24}
              height={24}
              className="transition-transform group-hover:scale-95"
            />
          </Button>

          <Button
            onClick={() => handleOAuthSignIn("facebook")}
            className="group w-full"
            variant="muted"
            loading={loading === "facebook"}
            title="Sign in with Facebook"
          >
            <FacebookIcon
              width={24}
              height={24}
              className="transition-transform group-hover:scale-95"
            />
          </Button>
        </div>

        <div className="divider !my-6 text-muted-foreground">or</div> */}

        <div className="mb-8">
          <SignInForm redirectTo={getReturnTo(returnTo)} />
        </div>

        <div className="space-y-4">
          <p className="mb-4 flex flex-wrap items-center justify-center text-center text-sm">
            <Link href="/forgot-password">
              <ButtonDiv variant="link" size="sm">
                Forgot your password?
              </ButtonDiv>
            </Link>

            <Link href={`/sign-up?${queryParams}`}>
              <ButtonDiv variant="link" size="sm">
                Sign up
              </ButtonDiv>
            </Link>

            <Link href={`/customer-sign-in`}>
              <ButtonDiv variant="link" size="sm">
                Customer dashboard
              </ButtonDiv>
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
