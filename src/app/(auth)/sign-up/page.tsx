import { Metadata } from "next";

import { AuthNavbar } from "@/components/auth/auth-navbar";
import { SignUpPage } from "@/components/auth/sign-up-page";
import { getServerTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join Fingertip to create custom forms, collect responses, and analyze feedback. Start building better connections with your audience today.",
};

export default async function Page() {
  const { t } = await getServerTranslations("common");

  return (
    <>
      <AuthNavbar />

      <div className="rounded-3xl border-0.5 border-border bg-background px-4 py-6 shadow-sm dark:shadow-none">
        <h1 className="h3 mb-6 text-center">{t("sign_up_title")}</h1>

        <SignUpPage />
      </div>
    </>
  );
}
