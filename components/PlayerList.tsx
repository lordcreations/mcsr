"use client";

import Image from "next/image";
import { formatTime } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  videoUrl?: string;
};

type Props = {
  players: Player[];
  search: string;
  setSelectedPlayer: (player: Player) => void;
  setDialogOpen: (open: boolean) => void;
  setLoadedImages: (updateFn: (prev: number) => number) => void;
  scoreType?: "points" | "time";
};

export default function PlayerList({
  players,
  search,
  setSelectedPlayer,
  setDialogOpen,
  setLoadedImages,
  scoreType = "points",
}: Props) {
  const filtered = players.filter((player) =>
    player.nickname.toLowerCase().includes(search.toLowerCase())
  );
  const isMobile = useIsMobile();

  const formatScore = (score: number) => {
    if (scoreType === "time") {
      const formattedTime = formatTime(score);
      return formattedTime.endsWith(".000")
        ? formattedTime.slice(0, -4)
        : formattedTime;
    }
    return score.toString();
  };

  return (
    <div className="max-h-[400px] overflow-y-auto pr-1 w-full">
      <ul className="divide-y divide-gray-300 dark:divide-gray-600 px-1">
        {filtered.map((player, idx) => (
          <li
            key={player.uuid}
            onClick={() => {
              setSelectedPlayer(player);
              setDialogOpen(true);
            }}
            className="flex items-center justify-between gap-3 py-3 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded group relative"
          >
            <div className="flex items-center gap-3">
              <span className="font-chat mt-4 text-sm w-8 text-center font-bold text-gray-500 dark:text-gray-400">
                {idx + 4}
              </span>
              <div className="flex items-center gap-2">
                <Image
                  src={`/api/player-head?uuid=${player.uuid}`}
                  alt={player.nickname}
                  width={40}
                  height={40}
                  className="w-10 h-10 shrink-0"
                  loading="lazy"
                  onLoad={() => setLoadedImages((prev) => prev + 1)}
                  style={{ transition: "transform 0.2s" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <div className="flex items-center gap-2">
                  <span className="font-chat text-base tracking-wide text-black dark:text-white relative top-[0.25rem] sm:top-[0.5rem] truncate">
                    {(() => {
                      const name = player.nickname;
                      const maxChars = 10;
                      return isMobile && name.length > maxChars
                        ? name.slice(0, maxChars - 3) + "..."
                        : name;
                    })()}
                  </span>
                  {player.hasLocalProfile &&
                    player.country.toLowerCase() !== "br" && (
                      <Image
                        src={`/flags/${player.country.toUpperCase()}.svg`}
                        alt={player.country}
                        width={20}
                        height={15}
                        className="w-5 h-auto relative -top-[0.15rem] sm:-top-[-0.3rem]"
                        loading="lazy"
                      />
                    )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-gray-900 dark:bg-white text-white dark:text-black font-chat text-sm px-2 py-1 rounded shadow pt-3">
                {formatScore(player.seasonResult.eloRate)}
              </span>
              {/* windows wild life video its actually a placeholder...*/}
              {player.videoUrl &&
                !player.videoUrl.includes("youtu.be/a3ICNMQW7Ok") && (
                  <a
                    href={player.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center p-1 "
                  >
                    <Image
                      src="/icons/youtube.svg"
                      alt="Video"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                      loading="lazy"
                    />
                  </a>
                )}
            </div>

            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-black font-minecraft text-xs px-3 py-1 rounded shadow border border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-30 tracking-wide">
              Detalhes do jogador
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
