"use client";
import "./globals.css";
import { ZeroProvider } from "@rocicorp/zero/react";
import { ReactNode } from "react";
import { createZero } from "@/lib/zero-setup";
import { RootStoreProvider } from "@/lib/stores/root-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const zero = createZero();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="Done" />
      <body className={`${inter.variable} font-sans antialiased`}>
        <ZeroProvider zero={zero}>
          <RootStoreProvider>{children}</RootStoreProvider>
        </ZeroProvider>

        <Toaster />
      </body>
    </html>
  );
}
