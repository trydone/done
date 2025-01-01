"use client";
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <DndProvider>
      <ZeroProvider zero={z}>
        <RootStoreProvider>
          <LoginProvider>
            <html lang="en">
              <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
              >
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
              </body>
            </html>
          </LoginProvider>
        </RootStoreProvider>
      </ZeroProvider>
    </DndProvider>
  );
}
