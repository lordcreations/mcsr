"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import PlayerDialog from "@/components/PlayerDialog";

type Player = {
  uuid: string;
  nickname: string;
  country: string;
  seasonResult: {
    eloRank: number;
    eloRate: number;
  };
  animationPhase?: number; // 🎯 not animation delay visually — just a phase offset
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const fullyLoaded = true;

  const filteredPlayers = players
    .slice(3)
    .filter((player) =>
      player.nickname.toLowerCase().includes(search.toLowerCase())
    );

  const loginWithMicrosoft = () => {
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;

    const redirectUri = "http://localhost:3000/api/auth/callback";
    const scope = "XboxLive.signin offline_access";
    const responseType = "code";

    const authUrl = `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
      scope
    )}`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setDarkMode(true);
      }
    }
  }, [mounted]);

  useEffect(() => {
    fetch("https://mcsrranked.com/api/leaderboard?country=br")
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data?.users || [])
          .filter((u: Player) => u.seasonResult)
          .sort(
            (a: Player, b: Player) =>
              a.seasonResult.eloRank - b.seasonResult.eloRank
          )
          .map((player: any) => ({
            ...player,
            animationPhase: Math.random() * -3,
          }));
        setPlayers(sorted);
        setLoading(false);
      });
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  if (!mounted) return null;

  return (
    <div
      className={`${darkMode ? "dark" : ""} w-full transition-all duration-500`}
    >
      {(loading || !fullyLoaded) && (
        <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center transition-opacity duration-500 space-y-42">
          <Image
            src="/image.png"
            alt="Loading"
            width={96}
            height={128}
            loading="lazy"
            className="w-24 h-32 animate-pulse"
            style={{ imageRendering: "pixelated" }}
            unoptimized
          />
        </div>
      )}

      {fullyLoaded && (
        <main className="w-full px-2 sm:px-4 transition-all duration-500 flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[#f7f7f8] to-[#e3e4e6] dark:from-[#0f172a] dark:to-[#1e293b] text-black dark:text-white animate-fade-in">
          <div className="px-3 sm:px-6 flex flex-col items-center justify-center w-full max-w-4xl p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-4">
              <div className="flex flex-col items-start leading-none">
                <p className="text-sm font-minecraft text-gray-500 dark:text-gray-400 mb-1 tracking-wide">
                  ARE YOU A RUNNER?
                </p>
                <button
                  // onClick={loginWithMicrosoft}
                  disabled
                  className="px-4 py-2 text-sm font-minecraft rounded border border-blue-500 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950 dark:text-white dark:border-blue-400 transition-all"
                >
                  EDIT YOUR PROFILE
                </button>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 mt-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-black dark:text-white text-xl"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? "☀" : "🌙"}
              </button>
            </div>

            <div className="mb-25">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/flags/br.svg"
                  alt="BR Flag"
                  width={40}
                  height={40}
                  className="h-[2.5rem] w-auto object-contain align-middle shadow"
                  loading="lazy"
                />
                <span
                  className="text-2xl font-minecraft text-gray-900 dark:text-white ml-2"
                  style={{
                    textShadow: darkMode
                      ? "2px 2px 0 rgba(255, 255, 255, 0.3)"
                      : "2px 2px 0 rgba(0, 0, 0, 0.3)",
                  }}
                >
                  BRAZIL
                </span>
              </div>
              <h1 className="font-minecraft  sm:text-4xl pb-2 font-minecraft text-white dark:text-black text-4xl bg-gray-900 dark:bg-white rounded shadow w-fit h-[60px] flex items-center justify-center px-6 leading-none">
                LEADERBOARD
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:flex flex-wrap items-end justify-center w-full sm:gap-6 mb-12">
              {players.slice(0, 3).map((player, index) => {
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

                const { lift, height, color, shadow, order, zIndex } =
                  ranks[index];

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
                      style={
                        {
                          animationDelay: `${player.animationPhase}s`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="pb-1 pt-4 text-md font-chat text-white bg-[rgba(0,0,0,0.5)] px-3 py-1 border tracking-normal leading-none text-center">
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
                              e.currentTarget.parentElement?.querySelector(
                                "div"
                              );
                            if (placeholder) placeholder.style.display = "none";
                          }}
                          style={{
                            transition: "transform 0.2s",
                            filter:
                              "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5))",
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
                    <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-black font-chat text-sm px-2  rounded shadow pt-3">
                      {player.seasonResult.eloRate}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="w-full max-h-[500px] overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 px-1 gap-2">
                <h2 className="text-2xl font-minecraft px-4 py-1 bg-gray-900 dark:bg-white text-white dark:text-black rounded shadow whitespace-nowrap pb-2">
                  OTHER PLAYERS
                </h2>
                <div className="relative w-[220px]">
                  <Image
                    src="/spyglass.webp"
                    alt="Search"
                    width={16}
                    height={16}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
                    loading="lazy"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded text-sm font-sans outline-none focus:ring-2 focus:ring-gray-500 relative sm:w-[220px]"
                  />
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-1">
                <ul className="divide-y divide-gray-300 dark:divide-gray-600 px-1">
                  <ul className="divide-y divide-gray-300 dark:divide-gray-600 px-1">
                    {filteredPlayers.map((player) => (
                      <li
                        key={player.uuid}
                        onClick={() => {
                          setSelectedPlayer(player);
                          setDialogOpen(true);
                        }}
                        className="flex items-center justify-between gap-3 py-3 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank */}
                          <span className="font-chat mt-4 text-sm w-8 text-center font-bold text-gray-500 dark:text-gray-400">
                            {player.seasonResult.eloRank}
                          </span>

                          {/* Head + Nickname wrapper */}
                          <div className="flex items-center gap-2">
                            {/* Avatar */}
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
                                (e.currentTarget.style.transform =
                                  "scale(1.05)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            />

                            {/* Nickname */}
                            <span className="font-chat text-base tracking-wide text-black dark:text-white relative top-[0.25rem] sm:top-[0.5rem]">
                              {player.nickname}
                            </span>

                            {/* Optional flag */}
                            {/* <Image
            src={`/flags/${player.country}.svg`}
            alt={`${player.country.toUpperCase()} Flag`}
            width={20}
            height={20}
            className="h-[1.25rem] w-auto object-contain"
            loading="lazy"
          /> */}
                          </div>
                        </div>

                        {/* Elo */}
                        <span className="bg-gray-900 dark:bg-white text-white dark:text-black font-chat text-sm px-2 py-1 rounded shadow pt-3">
                          {player.seasonResult.eloRate}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ul>
              </div>
            </div>
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
