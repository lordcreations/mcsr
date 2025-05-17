import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCSR Brazil Leaderboard",
  description: "Ranked Leaderboard for Minecraft Speedrunners in Brazil",
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
        {children}
    </div>
  );
}