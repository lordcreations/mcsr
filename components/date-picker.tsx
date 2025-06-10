"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Calendar24Props {
  time?: string
  onTimeChange?: (time: string) => void
}

export function Calendar24({
  time = "00:00.000",
  onTimeChange,
}: Calendar24Props) {
  const [internalTime, setInternalTime] = React.useState(time)
  const lastExternalTime = React.useRef(time)

  React.useEffect(() => {
    if (time !== lastExternalTime.current) {
      setInternalTime(time)
      lastExternalTime.current = time
    }
  }, [time])

  const formatTime = (raw: string): string => {
    const match = raw.match(/^(\d{1,2}):(\d{1,2})(\.(\d{1,4}))?$/)
    if (!match) return "00:00.000"

    const minutes = Math.min(59, parseInt(match[1] || "0"))
    const seconds = Math.min(59, parseInt(match[2] || "0"))
    const millis = parseInt((match[4] || "0").substring(0, 3))

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInternalTime(value)

    if (/^\d{1,2}:\d{1,2}(\.\d{1,3})?$/.test(value)) {
      lastExternalTime.current = value
      onTimeChange?.(value)
    }
  }

  const handleBlur = () => {
    const formatted = formatTime(internalTime)
    setInternalTime(formatted)
    lastExternalTime.current = formatted
    onTimeChange?.(formatted)
  }

  return (
    <div className="flex flex-col">
      <Label htmlFor="time" className="mb-1 text-sm font-medium text-muted-foreground">
        Time
      </Label>
      <Input
        type="text"
        id="time"
        value={internalTime}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="MM:SS.mmm"
        className="bg-white/10 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        inputMode="numeric"
        maxLength={12}
      />
      <span className="text-xs text-gray-500 mt-1">
        Format: <code>MM:SS.mmm</code> (max: 59:59.999)
      </span>
    </div>
  )
}
