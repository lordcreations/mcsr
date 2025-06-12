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
  videoUrl?: string;
  animationPhase?: number;
  hasLocalProfile?: boolean;
};

type Runs = {
  userProfileId: string;
  id: string;
  time: number;
  nickname: string;
  videoUrl?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function LeaderboardRSG({ isActive }: { isActive?: boolean }) {
  const [sortedData, setSortedData] = useState<Runs[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [, setLoadedImages] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => setMounted(true), []);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/local/RSG");
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        
        const data = await response.json();
        
        const sortedData = data.sort((a: Runs, b: Runs) => {
          if (a.time === b.time) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return a.time - b.time;
        });

        setSortedData(sortedData);

        const initialPlayers = sortedData.map((run: Runs, index: number): Player => ({
          uuid: run.userProfileId || `local-${run.id}`,
          nickname: run.nickname,
          country: "br",
          seasonResult: {
            eloRank: index + 1,
            eloRate: run.time,
          },
          videoUrl: run.videoUrl,
          animationPhase: Math.random() * -3,
          hasLocalProfile: Boolean(run.userProfileId),
        }));

        const playerUuids = sortedData
          .map((run: Runs) => run.userProfileId)
          .filter(Boolean);

        if (playerUuids.length > 0) {
          const chunkSize = 30;
          const chunks = [];

          for (let i = 0; i < playerUuids.length; i += chunkSize) {
            chunks.push(playerUuids.slice(i, i + chunkSize));
          }

          for (const chunk of chunks) {
            const queryParams = new URLSearchParams();
            chunk.forEach((uuid: string) => queryParams.append("uuids", uuid));
            
            const profilesResponse = await fetch(`/api/users/check-profiles?${queryParams}`);
            
            if (profilesResponse.ok) {
              const { profiles } = await profilesResponse.json();
              
              initialPlayers.forEach((player: { uuid: any; hasLocalProfile: boolean; country: any; }) => {
                const match = profiles.find((p: any) => p.uuid === player.uuid);
                if (match) {
                  player.hasLocalProfile = true;
                  player.country = match.country ?? player.country;
                }
              });
            }
          }
        }

        setTopPlayers(initialPlayers);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isActive || isActive === undefined) {
      fetchPlayers();
    }
  }, [isActive]);

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
            <RankingHeader title="RSG" isActive={isActive}/>
            <TopThreePlayers
              scoreType="time"
              players={topPlayers.slice(0, 3)}
              setSelectedPlayer={setSelectedPlayer}
              setDialogOpen={setDialogOpen}
              setLoadedImages={setLoadedImages}
            />
            <div className="hidden sm:block w-full mb-4">
              <SearchBar search={search} setSearch={setSearch} />
            </div>
            <PlayerList
              scoreType="time"
              players={topPlayers.slice(3)}
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
