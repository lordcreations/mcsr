"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: {
    uuid: string;
    nickname: string;
    country: string;
  } | null;
}

function validDate(date: any): React.ReactNode {
  if (!date) return "Desconhecido";
  const d = typeof date === "number" ? new Date(date * 1000) : new Date(date);
  if (isNaN(d.getTime())) return "Desconhecido";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PlayerDialog({ open, onOpenChange, player }: PlayerDialogProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player && open) {
      setLoading(true);
      fetch(`https://mcsrranked.com/api/users/${player.uuid}`)
        .then((res) => res.json())
        .then((res) => setData(res))
        .finally(() => setLoading(false));
    }
  }, [player, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full dark:bg-gray-900 bg-white text-black dark:text-white font-minecraft border border-gray-300 dark:border-gray-700 shadow-lg bg-[url('/textures/stone.png')] bg-repeat">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-1 font-chat uppercase">
            {player?.nickname}
          </DialogTitle>
          <p className="text-sm text-center text-gray-400 font-chat">
            ID: {player?.uuid}
          </p>
        </DialogHeader>

        {loading && <p className="text-center mt-4 font-minecraft">Carregando...</p>}

        {data && (
          <Tabs defaultValue="overview" className="w-full mt-4 font-minecraft">
            <TabsList className="flex justify-center gap-2 font-minecraft text-lg w-full">
              <TabsTrigger value="overview">Geral</TabsTrigger>
              <TabsTrigger value="history">Historico</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={`/flags/${player?.country}.svg`}
                    alt="Country"
                    width={24}
                    height={24}
                    className="rounded shadow"
                  />
                  <span className="uppercase text-sm opacity-90">{player?.country}</span>
                </div>

                <div className="space-y-2">
                  {[
                    { icon: "📅", label: "Entrou", value: validDate(data?.data?.timestamp?.firstOnline) },
                    { icon: "🗓️", label: "Ultimo Login", value: validDate(data?.data?.timestamp?.lastLogin) },
                    { icon: "🎯", label: "Pontos", value: data?.data?.eloRate ?? "N/A" },
                    { icon: "🏅", label: "Posicao", value: data?.data?.eloRank ?? "N/A" },
                    { icon: "📈", label: "Maior Elo", value: data?.data?.seasonResult?.highest ?? "N/A" },
                    { icon: "📉", label: "Menor Elo", value: data?.data?.seasonResult?.lowest ?? "N/A" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-md text-gray-600 dark:text-gray-400">{item.label}</span>
                      </div>
                      <span className="text-sm font-chat mt-2">{item.value}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-300 dark:border-gray-700" />

                <div className="flex flex-wrap gap-4 text-sm">
                  {data.data.connections?.twitch && (
                    <a
                      href={`https://twitch.tv/${data.data.connections.twitch.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-400 hover:underline"
                    >
                      <Image src="/icons/twitch.svg" alt="Twitch" width={18} height={18} />
                      {data.data.connections.twitch.name}
                    </a>
                  )}
                  {data.data.connections?.discord && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <Image src="/icons/discord.svg" alt="Discord" width={18} height={18} />
                      {data.data.connections.discord.name}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="text-base text-gray-700 dark:text-gray-300 space-y-4">
                {data.data.seasonResult ? (
                  <>
                    <div className="space-y-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between">
                        {/* <span>🧮 Last Elo</span> */}
                        <span>🧮 Ultimo Elo</span>
                        <span>{data.data.seasonResult.last?.eloRate ?? "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* <span>🏅 Last Rank</span> */}
                        <span>🏅 Ultimo Rank</span>
                        <span>{data.data.seasonResult.last?.eloRank ?? "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* <span>💠 Phase Points</span> */}
                        <span>💠 Pontos da Fase</span>
                        <span>{data.data.seasonResult.last?.phasePoint ?? 0}</span>
                      </div>
                    </div>

                    <hr className="border-gray-300 dark:border-gray-700" />

                    {data.data.seasonResult.phases?.length ? (
                      <div className="space-y-2">
                        {/* <p className="text-sm opacity-80">📜 Phase History:</p> */}
                        <p className="text-sm opacity-80">📜 Historico de Fases:</p>
                        <ul className="list-disc list-inside pl-2 space-y-1">
                          {data.data.seasonResult.phases.map((phase: any, index: number) => (
                            <li
                              key={index}
                              className="pl-1 animate-fade-in-up opacity-0 animate-delay-[150ms] animate-fill-forwards"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {/* Phase {phase.phase}: Elo {phase.eloRate}, Rank {phase.eloRank}, Points {phase.point} */}
                              Fase {phase.phase}: Elo {phase.eloRate}, Rank {phase.eloRank}, Pontos {phase.point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      // <p className="text-sm italic text-gray-500">No detailed history phases available.</p>
                      <p className="text-sm italic text-gray-500">Nenhum historico detalhado de fases disponivel.</p>
                    )}
                  </>
                ) : (
                  // <p className="text-sm italic text-gray-500">No history found.</p>
                  <p className="text-sm italic text-gray-500">Nenhum historico encontrado.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="text-base text-gray-700 dark:text-gray-300 space-y-1">
                {data.data.achievements?.display?.length ? (
                  <ul className="list-disc list-inside">
                    {data.data.achievements.display.map((ach: any, index: number) => (
                      <li key={index}>{ach.id.replace(/([A-Z])/g, " $1").trim()}</li>
                    ))}
                  </ul>
                ) : (
                  // <p>No achievements found.</p>
                  <p>Nenhuma conquista encontrada.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}