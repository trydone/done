import { ArrowRightIcon } from "@fingertip/icons";
import { Metadata } from "next";
import Link from "next/link";

import { AuthNavbar } from "@/components/auth/auth-navbar";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getServerTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Recover access to your Fingertip account. Follow our secure password reset process to regain access to your forms and responses.",
};

export default async function Page() {
  const { t } = await getServerTranslations("common");
  return (
    <>
      <AuthNavbar />

      <div className="rounded-3xl border-0.5 border-border bg-background px-4 py-6 shadow-sm dark:shadow-none">
        <h1 className="h3 mb-6 text-center">{t("reset_your_password")}</h1>

        <ForgotPasswordForm />

        <p className="mb-4 mt-6 flex flex-wrap items-center justify-center text-center text-sm">
          {t("sign_up_already_have_fingertip")}
          <Link
            href={`/sign-in`}
            className="group flex items-center pl-1 font-medium text-primary"
          >
            {t("sign_up_sign_in")}
            <ArrowRightIcon
              width={16}
              height={16}
              className="ml-0.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </p>
      </div>
    </>
  );
}
