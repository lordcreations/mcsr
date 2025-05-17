"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full transition-all duration-500">
      <main className="w-full flex items-center justify-center min-h-[calc(100vh-3.5rem)] p-4 bg-gradient-to-b from-[#f7f7f8] to-[#e3e4e6] dark:from-[#0f172a] dark:to-[#1e293b] text-black dark:text-white">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl">
          <Image
            src="/image.png"
            alt="MCSR Brazil"
            width={200}
            height={200}
            priority
            className="mb-8"
            style={{ imageRendering: "pixelated" }}
          />
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            MCSR Brazil
          </h1>
          
          <p className="text-lg mb-8 opacity-90 max-w-md">
            A platform for Brazilian Minecraft Speedrunners to compete, track records, and participate in tournaments.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/leaderboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all hover:scale-105"
            >
              View Leaderboard
            </Link>
            
            <Link 
              href="/tournaments"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg shadow transition-all hover:scale-105"
            >
              Tournaments
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}