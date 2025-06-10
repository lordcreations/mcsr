"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function getRandomChar() {
  return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
}

export default function RankingHeader({title, isActive, }: {title: string; isActive?: boolean; }) {
const [scrambledText, setScrambledText] = useState(["", "", ""]);
const [played, setPlayed] = useState(false);

useEffect(() => {
  if (title !== "RSG" || !isActive || played) {
    setScrambledText(title.split(""));
    return;
  }

  const target = "RSG".split("");
  let currentIndex = 0;
  let scrambleCount = 0;
  let intervalId: NodeJS.Timeout;

  const scramble = () => {
    setScrambledText((prev) =>
      prev.map((char, i) =>
        i < currentIndex ? target[i] : getRandomChar()
      )
    );
  };

  intervalId = setInterval(() => {
    if (scrambleCount < 6) {
      setScrambledText(() => Array(target.length).fill("").map(getRandomChar));
      scrambleCount++;
      return;
    }

    scramble();

    if (currentIndex >= target.length) {
      clearInterval(intervalId);
      setScrambledText(target);
      setPlayed(true);
    }

    currentIndex++;
  }, 100);

  return () => clearInterval(intervalId);
}, [title, isActive, played]);


  return (
    <div className="mb-24 flex flex-col sm:flex-row justify-center items-start sm:items-center w-full gap-4">
      <div className="order-2 mb-6 sm:mb-0 flex flex-col items-center justify-center w-full px-4">
        <div className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white rounded shadow px-6 py-2">
          <h1 className="font-minecraft text-3xl sm:text-4xl text-white dark:text-black leading-none mb-2 tracking-widest">
            {scrambledText.map((char, i) => (
              <span key={i} className="inline-block text-center">
                {char}
              </span>
            ))}
          </h1>
          <Image
            src="/flags/BR.svg"
            alt="BR Flag"
            width={32}
            height={32}
            className="h-8 w-auto object-contain align-middle mt-2 mb-1"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
