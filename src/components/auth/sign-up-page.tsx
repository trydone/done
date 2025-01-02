"use client";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@fingertip/icons";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { useConversion } from "@/lib/hooks/use-conversion";
import useQueryParams from "@/lib/hooks/use-query-params";
import { getSupabaseClient } from "@/lib/supabase/supabase-client";
import { clientGetUrl } from "@/lib/utils/client-get-url";
import {
  PAGE_TEMPLATE_REF,
  PAGE_THEME_REF,
  QR_CODE_ID_KEY,
  RETURN_TO_KEY,
  SITE_SLUG_KEY,
} from "@/lib/utils/constants";

type Provider = "google" | "apple" | "facebook";

const getReturnTo = (returnTo: string | null | undefined): string => {
  if (!returnTo) {
    return `/onboarding`;
  }

  if (["%2Fsites", "/sites"].includes(returnTo)) {
    return `/onboarding`;
  }

  return returnTo;
};

type Props = {
  overrideReturnTo?: string;
};

export const SignUpPage = ({ overrideReturnTo }: Props) => {
  useConversion();
  const supabase = getSupabaseClient();
  const { t } = useTranslation();

  const [loading, setLoading] = useState<Provider | undefined>();

  const searchParams = useSearchParams();
  const { getParamsAsRecord } = useQueryParams();
  const returnTo = overrideReturnTo || searchParams?.get("returnTo");
  const isBusiness = searchParams?.get("guest") !== "true";
  const qrCodeIdParam = searchParams?.get("qrCodeId");
  const siteSlugParam = searchParams?.get("siteSlug");
  const pageTemplateRefIdParam = searchParams?.get("pageTemplateRefId");
  const pageThemeIdParam = searchParams?.get("pageThemeIdParam");
  const forwardQuery = queryString.stringify(
    getParamsAsRecord({ exclude: ["returnTo"] }),
  );

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      setTimeout(() => {
        window.location.href = "/sites";
      }, 500);
    };

    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (qrCodeIdParam) {
    setCookie(QR_CODE_ID_KEY, qrCodeIdParam);
  }

  if (siteSlugParam) {
    setCookie(SITE_SLUG_KEY, siteSlugParam);
  }

  if (pageTemplateRefIdParam) {
    setCookie(PAGE_TEMPLATE_REF, pageTemplateRefIdParam);
  }

  if (pageThemeIdParam) {
    setCookie(PAGE_THEME_REF, pageThemeIdParam);
  }

  const queryParams = queryString.stringify({
    returnTo: getReturnTo(returnTo),
    guest: !isBusiness,
  });

  const handleOAuthSignIn = async (provider: Provider) => {
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
  };

  return (
    <>
      <div className="mb-8 flex flex-row justify-center space-x-3">
        <Button
          onClick={() => handleOAuthSignIn("google")}
          className="group w-full"
          variant="muted"
          loading={loading === "google"}
          title={t("sign_up_with_google")}
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
          title={t("sign_up_with_apple")}
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
          title={t("sign_up_with_facebook")}
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
        <SignUpForm
          isBusiness={isBusiness}
          returnTo={getReturnTo(returnTo)}
          forwardQuery={forwardQuery}
        />
      </div>

      <p className="mb-8 text-center text-sm">
        Signing up for a Fingertip account means you agree to the{" "}
        <a
          href={`${clientGetUrl()}/terms`}
          target="_blank"
          className="text-primary underline-offset-4 hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href={`${clientGetUrl()}/privacy`}
          target="_blank"
          className="text-primary underline-offset-4 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>

      <p className="mb-3 text-center text-sm">
        Already signed up?{" "}
        <Link
          href={`/sign-in?${queryParams}`}
          className="text-primary underline-offset-2 hover:underline"
        >
          {t("sign_up_sign_in")}
        </Link>
      </p>
    </>
  );
};
