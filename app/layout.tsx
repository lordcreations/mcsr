import type { Metadata } from "next";
import { Fira_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { MicrosoftAuthProvider } from "@/components/MicrosoftAuthProvider";
import { Toaster } from "@/components/ui/sonner"

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/minecraft-4"
          rel="stylesheet"
        />
      </head>
      <body className={`${firaMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MicrosoftAuthProvider>
            <Navbar />
            {children}
            <SpeedInsights />
            <Toaster />
            <Analytics />
          </MicrosoftAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
