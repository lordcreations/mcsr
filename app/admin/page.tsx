"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"
import { Calendar24 } from "@/components/date-picker"

export default function AdminPage() {
  const [ign, setIgn] = useState("")
  const [nickname, setNickname] = useState("")
  const [time, setTime] = useState("00:00.000")
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [api_key, setApiKey] = useState("")
  const handleSubmit = async () => {
    if (!nickname || !time || !videoUrl) {
      toast.error("Please fill in all fields.")
      return
    }

    const timeMatch = time.match(/^(\d+):(\d+)\.(\d+)$/)
    if (!timeMatch) {
      toast.error("Invalid time format. Please use MM:SS.mmm")
      return
    }

    const [_, minutes, seconds, milliseconds] = timeMatch
    const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 1000
    setLoading(true)
    try {
      const response = await fetch("/api/local/RSG", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api_key
        },
        body: JSON.stringify({ 
          nickname, 
          ign,
          time: totalSeconds,
          videoUrl,
          date: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || "Something went wrong.")
      } else {
        toast.success("Run submitted successfully!")
        setNickname("")
        setTime("00:00.000")
        setVideoUrl("")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex justify-center items-center w-full bg-gradient-to-b from-[#f7f7f8] to-[#e3e4e6] dark:from-[#0f172a] dark:to-[#1e293b] text-black dark:text-white p-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <Image 
            src="/image.png"
            alt="MCSR Logo"
            width={48}
            height={48}
            className="rounded"
            style={{ imageRendering: "pixelated" }}
          />
          <h1 className="font-minecraft text-xl tracking-wide drop-shadow-[1px_1px_0px_#000] text-white">
            Add RSG Speedrun
          </h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Player Nickname</Label>
            <Input
              placeholder="e.g. Dream"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-white/10 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Minecraft IGN</Label>
            <Input
              placeholder="e.g. Dream"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="bg-white/10 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Run Time</Label>
            <Calendar24 
              time={time}
              onTimeChange={setTime}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Video URL</Label>
            
            <Input
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-white/10 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
            />
          </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">x-api-key</Label>
          <Input
            placeholder="Enter your API key"
            value={api_key}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-white/10 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
          />
        </div>

          <Button
            className="w-full font-minecraft text-sm bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-t-2 border-r-2 animate-spin border-white"></span>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Run"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}