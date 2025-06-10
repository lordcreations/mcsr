import Image from "next/image";
import { formatTime } from "@/lib/utils";

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
  setSelectedPlayer: (player: Player) => void;
  setDialogOpen: (open: boolean) => void;
  setLoadedImages: (updateFn: (prev: number) => number) => void;
  scoreType?: "points" | "time";
};

export default function TopThreePlayers({
  players,
  setSelectedPlayer,
  setDialogOpen,
  setLoadedImages,
  scoreType = "points",
}: Props) {
  const ranks = [
    {
      lift: "-translate-y-4",
      height: "h-16",
      color: "from-yellow-300 via-yellow-400 to-yellow-500",
      shadow: "shadow-[0_4px_12px_rgba(255,255,0,0.4)]",
      order: "col-start-2 sm:order-1",
      zIndex: "z-20",
    },
    {
      lift: "translate-y-[-0.2rem]",
      height: "h-12",
      color: "from-gray-200 via-gray-300 to-gray-400",
      shadow: "shadow-[0_4px_12px_rgba(200,200,200,0.3)]",
      order: "col-start-1 sm:order-0",
      zIndex: "z-10",
    },
    {
      lift: "translate-y-0",
      height: "h-10",
      color: "from-amber-700 via-amber-600 to-amber-500",
      shadow: "shadow-[0_4px_12px_rgba(255,160,64,0.3)]",
      order: "col-start-3 sm:order-2",
      zIndex: "z-0",
    },
  ];

  const formatScore = (score: number) => {
    if (scoreType === "time") {
      const formattedTime = formatTime(score);
      return formattedTime.endsWith('.000') ? formattedTime.slice(0, -4) : formattedTime;
    }
    return score.toString();
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:flex flex-wrap items-end justify-center w-full sm:gap-6 mb-12">
      {players.map((player, index) => {
        const { lift, height, color, shadow, order, zIndex } = ranks[index];
        return (
          <div
            key={player.uuid}
            onClick={() => {
              setSelectedPlayer(player);
              setDialogOpen(true);
            }}
            className={`cursor-pointer w-28 sm:w-36 ${height} ${order} ${zIndex} bg-gradient-to-t ${color} ${shadow} rounded-t-lg flex flex-col items-center justify-end relative hover:brightness-110 transition duration-200`}
          >
            <div
              className={`flex flex-col items-center mb-1 ${lift} animate`}
              style={{ animationDelay: `${player.animationPhase}s` }}
            >
              <div className="pb-1 pt-4 text-md font-chat text-white bg-[rgba(0,0,0,0.5)] px-3 py-1 border text-center">
                {player.nickname}
              </div>
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
                <Image
                  src={`/api/player-head?uuid=${player.uuid}`}
                  alt={`Top ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 relative z-10"
                  priority={index < 3}
                  onLoad={(e) => {
                    setLoadedImages((prev) => prev + 1);
                    const placeholder =
                      e.currentTarget.parentElement?.querySelector("div");
                    if (placeholder) placeholder.style.display = "none";
                  }}
                  style={{
                    transition: "transform 0.2s",
                    filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5))",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  unoptimized
                />
              </div>
            </div>
            {player.hasLocalProfile && player.country.toLowerCase() !== "br" && (
              <Image
                src={`/flags/${player.country.toUpperCase()}.svg`}
                alt={player.country}
                width={20}
                height={15}
                className="absolute bottom-0 right-0 w-5 h-auto z-20 shadow mb-1 mr-1"
                loading="lazy"
              />
            )}
            <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-black font-chat text-sm px-2 rounded shadow pt-3">
              {formatScore(player.seasonResult.eloRate)}
            </span>

            {player.videoUrl && (
              <a
                href={player.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-0 m-1 p-1 flex items-center justify-center hover:scale-105"
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
        );
      })}
    </div>
  );
}
