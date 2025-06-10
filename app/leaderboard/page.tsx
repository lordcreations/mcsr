"use client";
import * as React from "react"

import { useEffect, useState } from "react";
import LeaderboardMCSR from "@/components/LeaderboardMCSR";
import LeaderboardRSG from "@/components/LeaderboardRSG";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function LeaderboardTabsPage() {
  const [mounted, setMounted] = useState(false);
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)


  useEffect(() => setMounted(true), []);
  
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
      console.log(api.selectedScrollSnap() + 1)
    })
  }, [api]);

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center w-full bg-gradient-to-b  min-h-full px-4 py-6 from-[#f7f7f8] to-[#e3e4e6] dark:from-[#0f172a] dark:to-[#1e293b] text-black dark:text-white">
      <div className="w-full max-w-4xl">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            <CarouselItem className="flex flex-col items-center justify-center w-full">
            
              <LeaderboardMCSR />
              
            </CarouselItem>
            <CarouselItem className="flex flex-col items-center justify-center w-full">
              <LeaderboardRSG isActive={current === 2} />
            </CarouselItem>
            
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
