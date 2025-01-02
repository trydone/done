import { Metadata } from "next";

import { SignInPage } from "@/components/auth/sign-in-page";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Access your Fingertip account securely. Manage your forms, view responses, and engage with your audience through our intuitive dashboard.",
};

export default function Page() {
  return <SignInPage />;
}
