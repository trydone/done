"use client";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@fingertip/icons";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { AuthNavbar } from "@/components/auth/auth-navbar";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Button, ButtonDiv } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase/supabase-client";
import { clientGetUrl } from "@/lib/utils/client-get-url";
import { RETURN_TO_KEY } from "@/lib/utils/constants";

type Provider = "google" | "apple" | "facebook";

const getReturnTo = (returnTo?: string | null): string => {
  if (!returnTo) {
    return `/sites`;
  }

  return returnTo;
};

export const SignInPage = () => {
  const { t } = useTranslation();
  const supabase = getSupabaseClient();

  const [showMFA, setShowMFA] = useState(false);
  const [loading, setLoading] = useState<Provider | undefined>();
  const searchParams = useSearchParams();

  const returnTo = searchParams?.get("returnTo");
  const isBusiness = searchParams?.get("guest") !== "true";

  const queryParams = queryString.stringify({
    returnTo: getReturnTo(returnTo),
    guest: !isBusiness,
  });

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data: mfaData, error: mfaError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (
        !mfaError &&
        mfaData.nextLevel === "aal2" &&
        mfaData.currentLevel !== "aal2"
      ) {
        setShowMFA(true);
        return;
      }

      setTimeout(() => {
        window.location.href = "/sites";
      }, 500);
    };

    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOAuthSignIn = useCallback(
    async (provider: Provider) => {
      try {
        setLoading(provider);
        setCookie(RETURN_TO_KEY, getReturnTo(returnTo));

        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${clientGetUrl()}/auth/callback`,
          },
        });

        if (error) {
          throw error;
        }
      } catch (error: any) {
        toast.error(error.message);
        setLoading(undefined);
      }
    },
    [returnTo, supabase.auth],
  );

  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setTimeout(() => {
        window.location.href = `/sign-in`;
      }, 500);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [supabase.auth]);

  return (
    <>
      <AuthNavbar />

      <div className="rounded-3xl border-0.5 border-border bg-background px-4 py-6 shadow-sm dark:shadow-none">
        <h1 className="h3 mb-6 text-center">{t("sign_in_title")}</h1>

        <div className="mb-8 flex flex-row justify-center space-x-3">
          <Button
            onClick={() => handleOAuthSignIn("google")}
            className="group w-full"
            variant="muted"
            loading={loading === "google"}
            title={t("sign_in_with_google")}
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
            title={t("sign_in_with_apple")}
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
            title={t("sign_in_with_facebook")}
          >
            <FacebookIcon
              width={24}
              height={24}
              className="transition-transform group-hover:scale-95"
            />
          </Button>
        </div>

        <div className="divider !my-6 text-muted-foreground">{t("or")}</div>

        <div className="mb-8">
          <SignInForm
            redirectTo={getReturnTo(returnTo)}
            showMFA={showMFA}
            setShowMFA={setShowMFA}
          />
        </div>

        <div className="space-y-4">
          {showMFA ? (
            <p className="mb-4 flex flex-wrap items-center justify-center text-center text-sm">
              Want to use a different account?{" "}
              <button
                onClick={handleSignOut}
                className="pl-1 text-left font-medium text-primary"
              >
                Sign out
              </button>
            </p>
          ) : (
            <p className="mb-4 flex flex-wrap items-center justify-center text-center text-sm">
              <Link href="/forgot-password">
                <ButtonDiv variant="link" size="sm">
                  {t("sign_in_forgot")}
                </ButtonDiv>
              </Link>

              <Link href={`/sign-up?${queryParams}`}>
                <ButtonDiv variant="link" size="sm">
                  {t("sign_up")}
                </ButtonDiv>
              </Link>

              <Link href={`/customer-sign-in`}>
                <ButtonDiv variant="link" size="sm">
                  Customer dashboard
                </ButtonDiv>
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};
