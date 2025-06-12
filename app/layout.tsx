import type { Metadata } from "next";
import { Fira_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Minecraft Speedrunning Brasil",
  description:
    "Plataforma brasileira de speedrun em Minecraft com rankings atualizados, recordes nacionais e perfil dos jogadores. Descubra os melhores tempos, participe da comunidade e acompanhe as competições de speedrun no Brasil.",
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

        <meta name="title" content="Minecraft Speedrunning Brasil" />
        <meta
          name="description"
          content="Plataforma brasileira de speedrun em Minecraft com rankings atualizados, recordes nacionais e perfil dos jogadores. Descubra os melhores tempos, participe da comunidade e acompanhe as competições de speedrun no Brasil."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mcsrbr.com/" />
        <meta property="og:title" content="Minecraft Speedrunning Brasil" />
        <meta
          property="og:description"
          content="Plataforma brasileira de speedrun em Minecraft com rankings atualizados, recordes nacionais e perfil dos jogadores. Descubra os melhores tempos, participe da comunidade e acompanhe as competições de speedrun no Brasil."
        />
        <meta
          property="og:image"
          content="https://www.mcsrbr.com/og-image.png?v=1"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.mcsrbr.com/" />
        <meta
          property="twitter:title"
          content="Minecraft Speedrunning Brasil"
        />
        <meta
          property="twitter:description"
          content="Plataforma brasileira de speedrun em Minecraft com rankings atualizados, recordes nacionais e perfil dos jogadores. Descubra os melhores tempos, participe da comunidade e acompanhe as competições de speedrun no Brasil."
        />
        <meta
          property="twitter:image"
          content="https://www.mcsrbr.com/og-image.png?v=1"
        />
      </head>
      <body className={`${firaMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>

          <SpeedInsights />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
