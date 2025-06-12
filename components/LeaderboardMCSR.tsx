"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import RankingHeader from "./RankingHeader";
import SearchBar from "./SearchBar";
import TopThreePlayers from "./TopThreePlayers";
import PlayerList from "./PlayerList";
import PlayerDialog from "@/components/PlayerDialog";

type Player = {
  uuid: string;
  nickname: string;
  country: string;
  seasonResult: {
    eloRank: number;
    eloRate: number;
  };
  animationPhase?: number;
  hasLocalProfile?: boolean;
};

export default function LeaderboardMCSR() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [, setLoadedImages] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => setMounted(true), []);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetch("https://mcsrranked.com/api/leaderboard?country=br")
      .then((res) => res.json())
      .then(async (data) => {
        const initialPlayers = (data.data?.users || [])
          .filter((u: Player) => u.seasonResult)
          .sort(
            (
              a: { seasonResult: { eloRank: number } },
              b: { seasonResult: { eloRank: number } }
            ) => a.seasonResult.eloRank - b.seasonResult.eloRank
          )
          .map((player: any) => ({
            ...player,
            animationPhase: Math.random() * -3,
          }));

        const playerUuids = initialPlayers.map((p: { uuid: any }) => p.uuid);
        const chunkSize = 30;
        const chunks = [];

        for (let i = 0; i < playerUuids.length; i += chunkSize) {
          chunks.push(playerUuids.slice(i, i + chunkSize));
        }

        for (const chunk of chunks) {
          const queryParams = new URLSearchParams();
          chunk.forEach((uuid: string) => queryParams.append("uuids", uuid));
          const response = await fetch(
            `/api/users/check-profiles?${queryParams}`
          );

          if (response.ok) {
            const { profiles } = await response.json();
            initialPlayers.forEach(
              (player: {
                uuid: any;
                hasLocalProfile: boolean;
                country: any;
              }) => {
                const match = profiles.find((p: any) => p.uuid === player.uuid);
                if (match) {
                  player.hasLocalProfile = true;
                  player.country = match.country ?? player.country;
                }
              }
            );
          }
        }

        setPlayers(initialPlayers);
        setLoading(false);
      });
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full transition-all duration-500">
      {loading && (
        <Image
          src="/image.png"
          alt="Loading"
          width={96}
          height={128}
          loading="lazy"
          className="w-24 h-32 animate-pulse justify-center mx-auto"
          style={{ imageRendering: "pixelated" }}
          unoptimized
        />
      )}
      {!loading && (
        <main className="w-full px-2 sm:px-4 flex items-center justify-center overflow-y-hidden bg-gradient-to-b from-[#f7f7f8] to-[#e3e4e6] dark:from-[#0f172a] dark:to-[#1e293b] text-black dark:text-white">
          <div className="px-3 sm:px-6 flex flex-col items-center w-full max-w-4xl p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            <RankingHeader title="RANKED" />
            <TopThreePlayers
              players={players.slice(0, 3)}
              setSelectedPlayer={setSelectedPlayer}
              setDialogOpen={setDialogOpen}
              setLoadedImages={setLoadedImages}
            />
            <div className="hidden sm:block w-full mb-4">
              <SearchBar search={search} setSearch={setSearch} />
            </div>
            <PlayerList
              players={players.slice(3)}
              search={search}
              setSelectedPlayer={setSelectedPlayer}
              setDialogOpen={setDialogOpen}
              setLoadedImages={setLoadedImages}
            />
          </div>
          <PlayerDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            player={selectedPlayer}
          />
        </main>
      )}
    </div>
  );
}
