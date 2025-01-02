import { Metadata } from "next";
import { redirect } from "next/navigation";

import { AcceptSiteInvitePage } from "@/components/auth/accept-site-invite-page";
import { AuthProvider } from "@/lib/hooks/use-token";
import { RootStoreProvider } from "@/lib/stores/root-store-provider";
import { QueryClientProvider } from "@/lib/utils/provider";
import { checkAuthAndMFA } from "@/lib/utils/server-auth";

export const metadata: Metadata = {
  title: "Accept Invite",
};

type Props = {
  params: Promise<{ siteInvitationId: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { siteInvitationId } = params;

  const authCheck = await checkAuthAndMFA({
    defaultPathname: `/accept-invite/${siteInvitationId}`,
    queryParams: params,
  });

  if (!authCheck.isAuthenticated && authCheck.redirectUrl) {
    redirect(authCheck.redirectUrl);
  }

  return (
    <AuthProvider>
      <QueryClientProvider>
        <RootStoreProvider>
          <AcceptSiteInvitePage siteInvitationId={siteInvitationId} />
        </RootStoreProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
