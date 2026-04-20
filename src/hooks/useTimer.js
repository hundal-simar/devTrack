import { useState, useEffect, useRef } from 'react'

export const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

export function useTimer() {
  const [seconds, setSeconds]     = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startedAt, setStartedAt] = useState(null)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const start = () => {
    if (!startedAt) setStartedAt(new Date())
    setIsRunning(true)
  }

  const pause = () => setIsRunning(false)

  const reset = () => {
    setIsRunning(false)
    setSeconds(0)
    setStartedAt(null)
  }

  return { seconds, isRunning, startedAt, start, pause, reset, displayTime: formatTime(seconds) }
}