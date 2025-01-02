"use client";
import "./globals.css";
import { ZeroProvider } from "@rocicorp/zero/react";
import { ReactNode, useCallback, useSyncExternalStore } from "react";
import { zeroRef } from "@/lib/zero-setup";
import { RootStoreProvider } from "@/lib/stores/root-store-provider";
import { LoginProvider } from "@/components/auth/login-provider";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/nav/footer";
import { DndProvider } from "@/components/dnd/dnd-context";
import localFont from "next/font/local";

const glide = localFont({
  src: [
    {
      path: "../public/fonts/Glide-Variable.woff2",
    },
  ],
  variable: "--font-glide",
  weight: "400 900",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const z = useSyncExternalStore(
    zeroRef.onChange,
    useCallback(() => zeroRef.value, []),
  );

  if (!z) {
    return null;
  }

  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="Done" />
      <body className={`${glide.variable} antialiased`}>
        <ZeroProvider zero={z}>
          <RootStoreProvider>
            <LoginProvider>
              <DndProvider>
                <SidebarProvider>
                  <AppSidebar />

                  <SidebarInset>
                    <header className="flex h-14 shrink-0 items-center gap-2">
                      <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                          orientation="vertical"
                          className="mr-2 h-4"
                        />
                      </div>
                    </header>

                    <div className="flex flex-1 flex-col gap-4 px-4 py-10">
                      {children}
                    </div>

                    <Footer />
                  </SidebarInset>
                </SidebarProvider>

                <Toaster />
              </DndProvider>
            </LoginProvider>
          </RootStoreProvider>
        </ZeroProvider>
      </body>
    </html>
  );
}
