import type { Metadata } from "next";
import { Fira_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MCSR Brazil",
  description: "Ranked Leaderboard for MCSR Brazil",
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function StatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
