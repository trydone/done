"use client";
// import { AppleIcon, FacebookIcon, GoogleIcon } from "lucide-react";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SignUpForm } from "@/components/auth/sign-up-form";
import useQueryParams from "@/hooks/use-query-params";
// import { Button } from "@/components/ui/button";

type Provider = "google" | "apple" | "facebook";

const getReturnTo = (returnTo: string | null | undefined): string => {
  if (!returnTo) {
    return `/inbox`;
  }

  return returnTo;
};

type Props = {
  overrideReturnTo?: string;
};

export const SignUpPage = ({ overrideReturnTo }: Props) => {
  const [loading, setLoading] = useState<Provider | undefined>();

  const searchParams = useSearchParams();
  const { getParamsAsRecord } = useQueryParams();
  const returnTo = overrideReturnTo || searchParams?.get("returnTo");
  const forwardQuery = queryString.stringify(
    getParamsAsRecord({ exclude: ["returnTo"] }),
  );

  const queryParams = queryString.stringify({
    returnTo: getReturnTo(returnTo),
  });

  const handleOAuthSignIn = async (provider: Provider) => {
    try {
      setLoading(provider);
      // setCookie(RETURN_TO_KEY, getReturnTo(returnTo));

      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider,
      //   options: {
      //     redirectTo: `https://trydone.io/auth/callback`,
      //   },
      // });

      // if (error) {
      //   throw error;
      // }
    } catch (error: any) {
      toast.error(error.message);
      setLoading(undefined);
    }
  };

  return (
    <>
      {/* <div className="mb-8 flex flex-row justify-center space-x-3">
        <Button
          onClick={() => handleOAuthSignIn("google")}
          className="group w-full"
          variant="muted"
          loading={loading === "google"}
          title="Sign up with Google"
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
          title="Sign up with Apple"
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
          title="Sign up with Facebook"
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
        <SignUpForm
          returnTo={getReturnTo(returnTo)}
          forwardQuery={forwardQuery}
        />
      </div>

      <p className="mb-8 text-center text-sm">
        Signing up for a Done account means you agree to the{" "}
        <a
          href={`https://trydone.io/terms`}
          target="_blank"
          className="text-primary underline-offset-4 hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href={`https://trydone.io/privacy`}
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
          Sign in
        </Link>
      </p>
    </>
  );
};
