import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import Header from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rigging",
  description: "Share your AI agent harness setup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--muted)]">
          rigging — a followingseas project ·{" "}
          <a href="https://github.com/followingseas/rigging" className="hover:text-[var(--accent)]">
            GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
