import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = { title: "FutsalHub", description: "Find and book futsal courts near you." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<div className="h-17 border-b" style={{ borderColor: "var(--border)" }} />}>
          <Nav />
        </Suspense>
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 md:px-16">
          <Suspense fallback={<p className="muted">Loading…</p>}>{children}</Suspense>
        </main>
      </body>
    </html>
  );
}