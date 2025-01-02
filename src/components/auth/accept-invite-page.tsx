"use client";
import { disableQuery, useMutation, useQuery } from "@connectrpc/connect-query";
import {
  acceptSiteInvitation,
  getSiteInvitation,
} from "@fingertip/creator-proto/gen/fingertip/creator/site_invitation/v1/site_invitation-SiteInvitationService_connectquery";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import queryString from "query-string";
import { useCallback, useContext } from "react";
import { toast } from "sonner";

import { Button, ButtonDiv } from "@/components/ui/button";
import { useRouter } from "@/lib/hooks/use-router";
import { RootStoreContext } from "@/lib/stores/root-store";
import { getSupabaseClient } from "@/lib/supabase/supabase-client";

import { useToken } from "../../lib/hooks/use-token";
import { AlertBanner } from "../shared/alert-banner";
import { Spinner } from "../shared/spinner";
import { FormControl } from "../ui/form-control";
import { Input } from "../ui/input";

type Props = {
  siteInvitationId: string;
};

export const AcceptSiteInvitePage = ({ siteInvitationId }: Props) => {
  const { token, callOptions, session } = useToken();
  const supabase = getSupabaseClient();
  const router = useRouter();
  const {
    localStore: { setCurrentSiteMeta, setCurrentWorkspaceMeta },
  } = useContext(RootStoreContext);
  const postHog = usePostHog();

  const { data, error, isPending } = useQuery(
    getSiteInvitation,
    !token ? disableQuery : { siteInvitationId },
    { callOptions },
  );

  const acceptMutation = useMutation(acceptSiteInvitation, {
    callOptions,
    onSuccess: () => {
      toast.success(`Successfully joined ${data?.siteName}`);
      // Redirect to specific site page using siteSlug
      router.push(`/sites/${data?.siteSlug}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAccept = () => {
    if (!token || !data?.invitation?.id) return;
    acceptMutation.mutate({ siteInvitationId });
  };

  const handleDecline = () => {
    router.push("/sites");
  };

  const handleSignInWithAnotherAccount = useCallback(async () => {
    try {
      postHog.reset();
      await supabase.auth.signOut();

      setCurrentSiteMeta(null);
      setCurrentWorkspaceMeta(null);

      const url = queryString.stringifyUrl({
        url: `/sign-in`,
        query: {
          returnTo: `/accept-invite/${siteInvitationId}`,
        },
      });

      router.push(url);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [
    postHog,
    router,
    setCurrentSiteMeta,
    setCurrentWorkspaceMeta,
    siteInvitationId,
    supabase.auth,
  ]);

  if (error) {
    return (
      <div className="container mx-auto my-10">
        <AlertBanner>{error.message}</AlertBanner>

        <Link href="/sites" className="mt-4">
          <ButtonDiv variant="ghost">Return home</ButtonDiv>
        </Link>
      </div>
    );
  }

  if (!token || isPending) {
    return (
      <div className="container mx-auto my-10">
        <Spinner />
      </div>
    );
  }

  if (!data?.invitation?.id) {
    return (
      <div className="container mx-auto mt-6">
        <span>No invitation found</span>

        <Link href="/sites" className="mt-4">
          <ButtonDiv>Return home</ButtonDiv>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto pt-6">
        <div className="rounded-3xl border-0.5 border-border bg-card px-6 py-8 shadow-sm">
          <h1 className="h2 mb-6">Accept invite to {data?.siteName}</h1>

          <FormControl
            name="email"
            label="Logged in account"
            caption={
              <>
                Not the right account?
                <button
                  onClick={handleSignInWithAnotherAccount}
                  className="ml-1 text-sm leading-none text-foreground underline opacity-80 hover:opacity-100"
                >
                  Sign in with another account
                </button>
              </>
            }
          >
            <Input value={session?.user?.email} disabled />
          </FormControl>

          <div className="mb-4 flex space-x-2">
            <Button
              variant="success"
              onClick={handleAccept}
              loading={acceptMutation.isPending}
              className="w-full flex-1"
            >
              Accept
            </Button>

            <Button variant="destructiveSecondary" onClick={handleDecline}>
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
