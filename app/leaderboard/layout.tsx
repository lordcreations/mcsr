import type { Metadata } from "next";

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

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {children}
    </div>
  );
}
