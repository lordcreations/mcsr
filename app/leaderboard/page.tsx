"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const searchParams = useSearchParams();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!api) return;

    const snapList = api.scrollSnapList();
    setCount(snapList.length);

    const category = searchParams.get("category")?.toUpperCase() || "RANKED";
    
    const categoryNames = ["RANKED", "RSG", "ESTADOS"];
    const initialIndex = categoryNames.findIndex(
      (name) => name === category
    );


    api.scrollTo(initialIndex);
    setCurrent(initialIndex + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      console.log("Current:", api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, searchParams]);

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center w-full bg-gradient-to-b min-h-full px-4 py-6 from-[#f7f7f8] to-[#e3e4e6] dark:from-[#0f172a] dark:to-[#1e293b] text-black dark:text-white">
      <div className="w-full max-w-4xl">
        <Carousel
          setApi={setApi}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent>
            <CarouselItem className="flex flex-col items-center justify-center w-full">
              <LeaderboardMCSR />
            </CarouselItem>
            <CarouselItem className="flex flex-col items-center justify-center w-full">
              <LeaderboardRSG isActive={current === 2} />
            </CarouselItem>
            <CarouselItem className="flex flex-col items-center justify-center w-full">
              {/*  */}
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                current === index + 1
                  ? "bg-blue-500"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
