import { Suspense } from "react";

import { AuthFooter } from "@/components/auth/auth-footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-full bg-background bg-gradient-to-b from-[#D5ECFE] to-background dark:from-card dark:to-card">
        <div className="container mx-auto max-w-lg px-4">
          {children}

          <AuthFooter />
        </div>
      </div>
    </>
  );
}
