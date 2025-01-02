import { Metadata } from "next";

import { AuthNavbar } from "@/components/auth/auth-navbar";
import { SignUpPage } from "@/components/auth/sign-up-page";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join Done to create custom forms, collect responses, and analyze feedback. Start building better connections with your audience today.",
};

export default async function Page() {
  return (
    <>
      <AuthNavbar />

      <div className="rounded-3xl border-0.5 border-border bg-background px-4 py-6 shadow-sm dark:shadow-none">
        <h1 className="h3 mb-6 text-center">Sign up</h1>

        <SignUpPage />
      </div>
    </>
  );
}
