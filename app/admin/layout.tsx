import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCSR Brazil Leaderboard",
  description: "Ranked Leaderboard for Minecraft Speedrunners in Brazil",
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {children}
    </div>
  );
}
